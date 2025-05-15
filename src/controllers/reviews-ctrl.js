import Product from "../Models/Product.js";
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
    const visitorId = req?.headers["x-visitor-id"];
    if(!visitorId) return res.status(403).end();
    try {
        const { productId } = req.params;

        const product = await Product.findOne({productId:productId})
        const review = new Review({ ...req.body, product: product._id, visitorId: visitorId });
        await review.save();

        res.status(201).json(review.toObject());
    } catch (error) {
        console.warn(error)
        res.status(400).json({ error: 'Failed to submit review' });
    }
}

async function reactToReview(req, res) {
    try {
        const visitorId = req?.headers['x-visitor-id'];
        if(!visitorId) return res.status(403).end();

        const { id } = req.params;
        const { type } = req.body; 
        const review = await Review.findById(id);
    
        if (!review) return res.status(404).json({ error: 'Review not found' });

        
        if(review?.votes[visitorId]?.type == type) delete review.votes[visitorId]
        else if (type === 'like') review.votes[visitorId] = {type:"liked"}
        else if (type === "dislike") review.votes[visitorId] = {type:"dislike"}
    
        await review.save();
        res.json(review);
    } catch (err) {
        res.status(400).json({ error: 'Failed to react to review' });
    }
}

export default reviewsController;