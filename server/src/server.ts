// Server imports
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

// Route Functions
import { authRegister } from './auth/authRegister';
import { authLogin } from './auth/authLogin';
import { authRefresh } from './auth/authRefresh';


// Set up web app using JSON
const app = express();
app.use(express.json());
app.use(cookieParser());

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
    const { accessToken, refreshToken, userId } = await authRegister(name, email, password, handle);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ userId: userId });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, userId } = await authLogin(email, password);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(200).json({ userId: userId });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken, id } = req.body;
    const token = await authRefresh(refreshToken, id);
    res.cookie('accessToken', token.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', token.refreshToken, { httpOnly: true, secure: true });
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

/* ---------------------------------------- HELPER FUNCTION ----------------------------------------  */
async function silentTokenRefresh(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)

  // Check if the token exists
  if (!token) {
    return next(); // Proceed to authenticateToken middleware
  }

  try {
    // Verify the access token
    jwt.verify(token, process.env.ACCESS_JWT_SECRET as string, async (err, decodedToken: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Token has expired; try to refresh it
          const refreshToken = req.cookies.refreshToken;

          if (refreshToken) {
            try {
              // Call authRefresh to refresh tokens
              const { accessToken, refreshToken: newRefreshToken } = await authRefresh(refreshToken, decodedToken.userId);

              // Set the new access and refresh tokens in cookies
              res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
              res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

              // Continue with the request using the new access token
              req.headers['authorization'] = `Bearer ${accessToken}`;
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          console.error(err);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }

  next(); // Proceed to authenticateToken middleware
}

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_JWT_SECRET as string, (err) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    next()
  })
}
