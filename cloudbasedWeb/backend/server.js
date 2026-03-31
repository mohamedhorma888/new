import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportsRouter from './routes/reports.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/reports', reportsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
