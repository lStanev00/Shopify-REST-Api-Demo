import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: "dwxizz4ue",
    api_key: "747774519758396",
    api_secret: process.env.cloudinary_secret,
});

export default cloudinary;
