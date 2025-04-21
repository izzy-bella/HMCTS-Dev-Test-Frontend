import axios from 'axios';
import { Application, Request, Response } from 'express';

export default function (app: Application): void {
  const BASE_API = 'http://localhost:4000/get-example-case';

  // List all cases with search, sorting, pagination
  app.get('/cases', async (req: Request, res: Response) => {
    try {
      const search = (req.query.q as string)?.toLowerCase() || '';
      const sort = req.query.sort as string || '';
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 5;

      const response = await axios.get(BASE_API);
      let cases = response.data;

      // Filter
      if (search) {
        cases = cases.filter((c: any) =>
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.caseNumber.toLowerCase().includes(search)
        );
      }

      // Sort
      if (sort === 'createdDate_asc') {
        cases.sort((a: any, b: any) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
      } else if (sort === 'createdDate_desc') {
        cases.sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      }

      // Pagination
      const totalPages = Math.ceil(cases.length / pageSize);
      const paginated = cases.slice((page - 1) * pageSize, page * pageSize);

      res.render('cases', {
        cases: paginated,
        page,
        totalPages,
        query: search,
        sort,
        successMessage: req.query.success || null
      });
    } catch (error) {
      console.error('Failed to load cases', error);
      res.render('cases', { cases: [], page: 1, totalPages: 1 });
    }
  });

  // View Case by ID
  app.get('/cases/:id', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${BASE_API}/${req.params.id}`);
      res.render('case-view', { case: response.data });
    } catch (err) {
      console.error(err);
      res.status(404).render('error', { message: 'Case not found' });
    }
  });

  // Edit Case
  app.get('/cases/:id/edit', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(`${BASE_API}/${req.params.id}`);
      res.render('case-edit', { case: response.data });
    } catch (err) {
      res.status(404).render('error', { message: 'Case not found' });
    }
  });

  app.post('/cases/:id/edit', async (req: Request, res: Response) => {
    const caseId = req.params.id;
    try {
      const existing = await axios.get(`${BASE_API}/${caseId}`);
      const updated = {
        ...existing.data,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        notes: existing.data.notes || []
      };

      if (req.body.notes && req.body.notes.trim()) {
        updated.notes.push({
          text: req.body.notes.trim(),
          date: new Date().toISOString()
        });
      }

      await axios.put(`${BASE_API}/${caseId}`, updated);
      res.redirect('/cases?success=Case updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Failed to update case' });
    }
  });
  // Display new case form
  app.get('/case-new', (_req: Request, res: Response) => {
    res.render('case-new');
  });

  // Submit new case
  app.post('/case-new/confirm', async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, title, description, status, notes } = req.body;

      const response = await axios.get(BASE_API);
      const allCases = response.data;
      const nextId = allCases.length > 0
        ? Math.max(...allCases.map((c: any) => parseInt(c.id))) + 1
        : 1;

      const newCase = {
        id: nextId.toString(),
        firstName,
        lastName,
        caseNumber: `${lastName.toUpperCase()}-${firstName.toUpperCase()}-${nextId}`,
        title,
        description,
        status,
        createdDate: new Date().toISOString(),
        notes: notes && notes.trim()
          ? [{ text: notes.trim(), date: new Date().toISOString() }]
          : []
      };

      await axios.post(BASE_API, newCase);
      res.redirect('/cases?success=Case successfully submitted');
    } catch (err) {
      console.error('Failed to create case:', err);
      res.redirect('/cases?error=Failed to create case');
    }
  });
  // Delete Case
  app.post('/cases/:id/delete', async (req: Request, res: Response) => {
    try {
      await axios.delete(`${BASE_API}/${req.params.id}`);
      res.redirect('/cases?success=Case deleted');
    } catch (err) {
      res.status(500).render('error', { message: 'Failed to delete case' });
    }
  });
}
