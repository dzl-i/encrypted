// Server imports
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import errorHandler from "middleware-http-errors";
import cors from 'cors';

// Route Functions
import { authRegister } from './auth/authRegister';
import { authLogin } from './auth/authLogin';


// Set up web app using JSON
const app = express();
app.use(express.json());

// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || '3000');


// HEALTH CHECK ROUTE
app.get('/', (req: Request, res: Response) => {
  console.log("Health check")
  return res.status(200).json({
    message: "Server is up!"
  });
});


// AUTH ROUTES
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, handle } = req.body;
    res.status(200).json(await authRegister(name, email, password, handle));
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    res.status(200).json(await authLogin(email, password));
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// Logging errors
app.use(morgan('dev'));

app.use(errorHandler());

// Start server
const server = app.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || '3000'}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
