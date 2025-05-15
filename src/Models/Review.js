import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    title: { type: String },
    name: { type: String, required: true },
    content: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    media: [{ type: String }],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    votes: {
      type: Map,
      of: new mongoose.Schema(
        {
          type: { type: String, enum: ["like", "dislike"], required: true },
          date: { type: Date, default: Date.now },
        },
        { _id: false }
      ),
      default: {},
    },
    visitorId: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model(`Review`, reviewSchema);
export default Review;
