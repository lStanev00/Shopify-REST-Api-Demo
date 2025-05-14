import express from 'express';
import cors from 'cors';
import router from './src/router.js';
import dotenv from "dotenv";
import { connectDB } from './src/helpers/mongoose-helpers.js';
import { startBackgroundTask, updateItems } from './src/repetitive-updates/update-items.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
await connectDB();

app.use(cors());
app.use(express.json());
app.use(`/`, router);

startBackgroundTask(updateItems, 86400000);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
