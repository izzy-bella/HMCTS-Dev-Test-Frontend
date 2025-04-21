import * as path from 'path';

import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');

    const env = nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    // 👇 Add custom date filter
    env.addFilter('formatDate', function (dateString: string) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
