import { Router } from "express";
import { storefront } from "../helpers/help-fetch.js";
import Product from "../Models/Product.js";

const productCtrl = Router();

productCtrl.get(`/product/:name`, getProduct);

async function getProduct(req, res) {
  const { name } = req.params;

  try {
    const data = await storefront.fetchProductByHandle(name);
    if (data) {
      const local = await Product.findOne({slug:name}).populate(`reviews`).lean();
      data.reviews = local?.reviews;
      return res.status(200).json(data);
    }
    return res.status(500).end();
  } catch (error) {
    console.warn(error);
    return res.status(500).end();
  }
}

export default productCtrl;
