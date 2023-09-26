// Server imports
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

// Route Functions
import { authRegister } from './auth/authRegister';


// Set up web app using JSON
const app = express();
app.use(express.json());

// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';


// Health check for the server
app.get('/', (req: Request, res: Response) => {
  return res.json({
    message: "Server is up!"
  });
});


// AUTH ROUTES
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, handle } = req.body;
    res.json(await authRegister(name, email, password, handle));
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// Logging errors
app.use(morgan('dev'));

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || config.port}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
