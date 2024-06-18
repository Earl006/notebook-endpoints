import express from 'express';
import crudRouter from './router/crud.router';
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:4200' // frontend url
}));

app.use(express.json());
app.use('/notes', crudRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});