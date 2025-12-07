import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.route';

const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);

// fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.get("/", (_req, res) => {
  res.json({ message: `🎓 School Management APIs Server Running on ${PORT}` });
});

export default app;