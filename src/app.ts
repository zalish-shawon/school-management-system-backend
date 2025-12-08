import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.route';
import userRoutes from "./modules/users/user.route";
import studentRoutes from "./modules/student/student.route";
import teacherRoutes from "./modules/teachers/teacher.route";
import classRoutes from "./modules/class/class.route";
import subjectRoutes from "./modules/subjects/subject.route";
import timetableRoutes from "./modules/timetable/timetable.route";
import attendanceRoutes from './modules/attendance/attendance.route';
import examRoutes from './modules/exams/exam.route';
import libraryRoutes from './modules/library/library.route';
import notificationRoutes from './modules/notifications/notification.route';
import reportsRoutes from './modules/reports/reports.route';


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
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetable", timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/library', libraryRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportsRoutes);



// fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.get("/", (_req, res) => {
  res.json({ message: `🎓 School Management APIs Server Running on ${PORT}` });
});

export default app;