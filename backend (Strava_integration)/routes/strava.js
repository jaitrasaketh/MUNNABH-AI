// backend/routes/strava.js
import express from 'express';
import axios from 'axios';
import queryString from 'query-string';

const router = express.Router();

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

router.get('/authorize', (req, res) => {
  const queryParams = queryString.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'read,activity:read_all',
  });
  res.redirect(`https://www.strava.com/oauth/authorize?${queryParams}`);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });
    const { access_token } = response.data;
    res.redirect(`http://localhost:3000/strava-callback?access_token=${access_token}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
