import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    content: { type: String },
    photo: { type: String }, 
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);
