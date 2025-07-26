import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Auth Service is up!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
