import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: false
    }]
});

const Product = mongoose.model(`Product`, productSchema);
export default Product;
