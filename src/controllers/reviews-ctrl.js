import Review from "../Models/Review.js";
import { Router } from "express";

const reviewsController = Router();

reviewsController.get('/reviews/:productId', getReviews);
reviewsController.post('/reviews/:productId', postReview);
reviewsController.patch("/reviews/:id/react", reactToReview);

async function getReviews(req, res) {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
}

async function postReview(req, res) {
    try {
        const { productId } = req.params;
        const review = new Review({ ...req.body, productId });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ error: 'Failed to submit review' });
    }
}

async function reactToReview(req, res) {
    try {
        const { id } = req.params;
        const { type } = req.body; 
        const review = await Review.findById(id);
    
        if (!review) return res.status(404).json({ error: 'Review not found' });
    
        if (type === 'like') review.likes++;
        if (type === "dislike") review.dislikes++;
    
        await review.save();
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: 'Failed to react to review' });
    }
}

export default reviewsController;