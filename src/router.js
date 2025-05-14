import { Router } from "express";
import reviewsController from "./controllers/reviews-ctrl.js";

const router = Router();

router.use(`/`, reviewsController);

router.use("/", (req, res) => {
    res.status(404).send("The API don't support this route yet").end();
})

export default router;