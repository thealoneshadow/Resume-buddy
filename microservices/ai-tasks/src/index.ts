import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.send('AI Service is up!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
