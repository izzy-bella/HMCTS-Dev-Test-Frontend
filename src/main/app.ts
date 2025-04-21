import * as path from 'path';

import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';
import caseRoutes from './routes/cases';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { glob } from 'glob';
import favicon from 'serve-favicon';


const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

// Setup view engine with Nunjucks and custom filters
new Nunjucks(developmentMode).enableFor(app);

// Register middleware
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

// Register routes
caseRoutes(app); // Your custom route for /cases, /cases/:id etc.

//  Auto-discover other routes
glob
  .sync(path.join(__dirname, 'routes', '**/*.+(ts|js)'))
  .filter(file => !file.includes('cases.ts')) // skip if already registered
  .forEach(file => {
    const route = require(file);
    if (typeof route.default === 'function') {
      route.default(app);
    }
  });

// Setup development environment (like mock SSL in dev mode)
setupDev(app, developmentMode);

// Global error handler
app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  console.error(err);

  res.locals.message = err.message || 'Something went wrong';
  res.locals.error = developmentMode ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

