// Server imports
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { Server as IoServer } from 'socket.io';
import { parse } from 'cookie';

// Route Functions
import { authRegister } from './auth/authRegister';
import { authLogin } from './auth/authLogin';
import { authRefresh } from './auth/authRefresh';
import { getHash } from './helper/util';
import { authLogout } from './auth/authLogout';
import { dmCreate } from './dm/dmCreate';
import { dmList } from './dm/dmList';
import { dmMessages } from './dm/dmMessages';
import { storeMessage } from './helper/messageHelper';
import { checkAuthorisation } from './helper/dmHelper';
import { getUserByHandle } from './helper/userHelper';


const prisma = new PrismaClient()


// Set up web app using JSON
const app = express();
app.use(express.json());
app.use(cookieParser());

const httpServer = new Server(app);
const io = new IoServer(httpServer, {
  cors: {
    origin: ["http://localhost:3001", "https://encrypted-tau.vercel.app", "https://encrypted.denzeliskandar.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Use middleware that allows for access from other domains
app.use(cors({
  origin: ["http://localhost:3001", "https://encrypted-tau.vercel.app", "https://encrypted.denzeliskandar.com"],
  credentials: true
}));

const PORT: number = parseInt(process.env.PORT || '3000');
const isProduction: boolean = process.env.NODE_ENV === "production"


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

    // Assign cookies
    res.cookie('accessToken', accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 900000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

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

    // Assign cookies
    res.cookie('accessToken', accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 900000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(200).json({ userId: userId });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const token = await authRefresh(refreshToken);

    // Assign cookies
    res.cookie('accessToken', token.accessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 900000 });
    res.cookie('refreshToken', token.refreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

    res.header('Access-Control-Allow-Credentials', 'true');

    res.sendStatus(200);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/auth/logout', silentTokenRefresh, authenticateToken, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authLogout(refreshToken);

    res.sendStatus(200);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// DM ROUTES
app.post('/dm/create', silentTokenRefresh, authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { userHandles } = req.body;

    const dm = await dmCreate(userId, userHandles);

    const dmData = {
      id: dm.id,
      dmName: dm.dmName, // You can adjust this based on your DM model structure
    };

    io.emit('new_dm_created', dmData);

    res.status(200).json({ dmId: dm.id });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.get('/dm/list', silentTokenRefresh, authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const dms = await dmList(userId);

    res.status(200).json({ dms: dms });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

app.post('/dm/messages', silentTokenRefresh, authenticateToken, async (req: Request, res: Response) => {
  try {
    const dmId = req.body.dmId;
    const messages = await dmMessages(dmId);

    res.status(200).json({ messages: messages });
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});


// SocketIO Connection
io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  socket.on('join', (dmId) => {
    socket.join(dmId);  // The user joins a room named after the DM's ID.
    console.log(`User joined DM: ${dmId}`);
  });

  socket.on('send_dm_message', async (dmId, message, callback) => {
    const userId = socket.data.userId;
    console.log(userId, dmId, message);

    // Storing the message and getting the stored message object
    const storedMessage = await storeMessage(userId, message, dmId);

    socket.to(dmId).emit('receive_dm_message', storedMessage); // Sends message only to users in the DM.

    // Return the stored message as acknowledgement
    callback(storedMessage);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

io.use((socket, next) => {
  const rawCookies = socket.request.headers.cookie;
  const parsedCookies = parse(rawCookies || '');

  const accessToken = parsedCookies['accessToken'];

  try {
    // Verifying the token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET as string) as JwtPayload;
    socket.data.userId = decoded.userId;

    next();
  } catch (err) {
    // Handling token verification errors
    next(new Error('Authentication error'));
  }
});


// Logging errors
app.use(morgan('dev'));

app.use(errorHandler());

// Start server
const server = httpServer.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || '3000'}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

/* ---------------------------------------- HELPER FUNCTION ----------------------------------------  */
async function silentTokenRefresh(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) return res.status(401).json({ error: "No access token and refresh token provided." });

  try {
    jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET as string);

    // If token verifies without any issues - continue
    return next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || !accessToken) {
      // Refresh expired token
      if (refreshToken) {
        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await authRefresh(refreshToken);

          res.locals.newAccessToken = newAccessToken;

          // Set the new access and refresh tokens in cookies
          res.cookie('accessToken', newAccessToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 900000 });
          res.cookie('refreshToken', newRefreshToken, { httpOnly: isProduction, path: "/", secure: isProduction, sameSite: isProduction ? "none" : "lax", maxAge: 7776000000 });

          return next();
        } catch (error) {
          console.error(error);
          return res.status(401).json({ error: "Refresh token is invalid or expired." });
        }
      } else {
        return res.status(401).json({ error: "Refresh token not provided." });
      }
    }

    // If there's an error other than token expiration, send a 403 Forbidden.
    return res.status(403).json({ error: "Invalid access token." });
  }
}

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = res.locals.newAccessToken || req.cookies.accessToken;

  if (!accessToken) return res.status(401).json({ error: "No access token provided." });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET as string) as JwtPayload;
    if (decoded && decoded.userId) {
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!user) {
        return res.status(403).json({ error: "User not found." });
      }

      if (user.remainingLoginAttempts <= 0) {
        return res.status(403).json({ error: "User is blocked." });
      }

      res.locals.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({ error: "Invalid access token." });
    }
  } catch (err) {
    res.status(403).json({ error: "Invalid access token." });
  }
}
