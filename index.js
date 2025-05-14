import express from 'express';
import cors from 'cors';
import router from './src/router.js';
import dotenv from "dotenv";
import { connectDB } from './src/helpers/mongoose-helpers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

await connectDB();

app.use(cors());
app.use(express.json());
app.use(`/`, router);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
