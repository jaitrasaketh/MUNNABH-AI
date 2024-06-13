// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import stravaRoutes from './routes/strava.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/strava', stravaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
