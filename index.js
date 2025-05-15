import express from 'express';
import cors from 'cors';
import router from './src/router.js';
import dotenv from "dotenv";
import { connectDB } from './src/helpers/mongoose-helpers.js';
import { startBackgroundTask, updateItems } from './src/repetitive-updates/update-items.js';
import { storefront } from './src/helpers/help-fetch.js';

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 8080;
await connectDB();
app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(`/`, router);


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
startBackgroundTask(updateItems, 86400000);