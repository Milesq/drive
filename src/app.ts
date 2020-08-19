import express from 'express';
import authRouter from './auth';
import uploadRouter from './upload';

const app = express();

app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

export default app;
