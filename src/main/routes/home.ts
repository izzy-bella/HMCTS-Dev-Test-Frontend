import axios from 'axios';
import { Application, Request, Response } from 'express';

export default function (app: Application): void {
  // Homepage
  app.get('/', async (_req: Request, res: Response) => {
    try {
      const response = await axios.get('http://localhost:4000/cases?page=0&size=5');
      res.render('home', { example: response.data });
    } catch (error) {
      console.error('Error fetching case list:', error);
      res.render('home', { example: [] });
    }
  });

  // Sign-in
  app.get('/sign-in', (_req: Request, res: Response) => {
    res.render('sign-in');
  });

  app.post('/sign-in', (_req: Request, res: Response) => {
    res.redirect('/dashboard');
  });

  // Dashboard
  app.get('/dashboard', async (_req: Request, res: Response) => {
    try {
      const response = await axios.get('http://localhost:4000/get-example-case');
      const cases = response.data;

      const total = cases.length;
      const open = cases.filter((c: any) => c.status === 'Open').length;
      const closed = cases.filter((c: any) => c.status === 'Closed').length;
      const overdue = cases.filter((c: any) => c.status === 'Overdue').length;

      res.render('dashboard', {
        totalCases: total,
        openCases: open,
        closedCases: closed,
        overdueCases: overdue
      });
    } catch (err) {
      res.render('dashboard', {
        totalCases: 0,
        openCases: 0,
        closedCases: 0,
        overdueCases: 0
      });
    }
  });

  // All cases
  app.get('/cases', async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string;
      const sort = req.query.sort as string;

      const response = await axios.get('http://localhost:4000/cases', {
        params: {
          search,
          page: 0,
          size: 50
        }
      });

      const cases = response.data || [];

      if (sort === 'date') {
        cases.sort((a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      }

      res.render('cases', { cases, search, sortBy: sort });
    } catch (err) {
      console.error('Error loading cases:', err);
      res.render('cases', { cases: [] });
    }
  });

  // View single case
  app.get('/cases/:id/view', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const response = await axios.get(`http://localhost:4000/cases/${id}`);
      res.render('case-view', { case: response.data });
    } catch (error) {
      console.error('Error fetching case by ID:', error);
      res.status(404).render('error', { message: 'Case not found' });
    }
  });

  // Stubbed Edit (no backend POST support yet)
  app.post('/cases/:id/edit', (req: Request, res: Response) => {
    const { title, status } = req.body;
    console.log(`EDITED CASE: ${req.params.id}`, { title, status });
    res.redirect(`/cases/${req.params.id}/view`);
  });

  // Stubbed Delete (no backend DELETE support yet)
  app.post('/cases/:id/delete', (req: Request, res: Response) => {
    console.log(`DELETED CASE: ${req.params.id}`);
    res.redirect('/cases');
  });

  // Dashboard metrics link
  app.get('/metrics/total-cases', (_req: Request, res: Response) => {
    res.redirect('/cases');
  });
}
