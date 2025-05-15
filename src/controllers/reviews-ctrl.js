import Product from "../Models/Product.js";
import Review from "../Models/Review.js";
import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../helpers/cloudinary-config.js";
import { delay } from "../helpers/delay.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "review-images",
        allowed_formats: ["jpg", "png", "webp"],
    },
});

const upload = multer({ storage });

const reviewsController = Router();

reviewsController.get("/reviews/:productId", getReviews);
reviewsController.post("/reviews/:productId", upload.array("images", 4), postReview);
reviewsController.patch("/reviews/:id/react", reactToReview);

async function getReviews(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({productId: productId});
    if (product) throw new Error(`no product:  ${productId}`);
    const reviews = await Review.findOne({ product: product._id });
    res.json(reviews);
  } catch (err) {
    console.warn(err)
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

async function postReview(req, res) {
  const visitorId = req?.headers["x-visitor-id"];
  if (!visitorId) return res.status(403).end();
  try {
    const { productId } = req.params;
    const imageUrls = req.files?.map(file => file.path) || [];
    if (req.body && req.body.rating != null) req.body.rating = Number(req.body.rating);

    const product = await Product.findOne({ productId: productId });
    const review = new Review({
      ...req.body,
      product: product._id,
      visitorId: visitorId,
      media: imageUrls,
    });
    await review.save();

    res.status(201).json(review.toObject());
  } catch (error) {
    console.warn(error);
    res.status(400).json({ error: "Failed to submit review" });
  }
}

async function reactToReview(req, res) {

  try {
    const visitorId = req?.headers["x-visitor-id"];
    if (!visitorId) return res.status(403).end();

    const { id } = req.params;
    const { type } = req.body;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ error: "Review not found" });

    let trigger = false;
    if (review?.votes[visitorId]?.type == type) {
      delete review.votes[visitorId];
      trigger = true;
    } else if (type == "like") {
      review.votes[visitorId] = `like`;
      trigger = true;
    } else if (type == "dislike") {
      review.votes[visitorId] = `dislike`;
      trigger = true;
    }

    if (trigger) review.markModified("votes");

    await review.save();
    delay(100)
    const newObj = await Review.findById(review._id).lean();
    res.status(200).json(newObj);
  } catch (err) {
    console.warn(err)
    res.status(500).json({ error: "Failed to react to review" });
  }
}

export default reviewsController;
