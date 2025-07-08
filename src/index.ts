import express from 'express';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', routes);

console.log(typeof errorHandler); // should be 'function'

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
