import { Router } from "express";
import { storefront } from "../helpers/help-fetch";

const productCtrl = Router();

productCtrl.get(`/product/:name`, getProduct);

async function getProduct(req, res) {
  const { name } = req.params;

  try {
    const data = await storefront.fetchProductByHandle(name);
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(500).end();
  } catch (error) {
    console.warn(error);
    return res.status(500).end();
  }
}

export default productCtrl;
