import { delay } from "../helpers/delay.js";
import getBGTime from "../helpers/get-time.js";
import { storefront } from "../helpers/help-fetch.js";
import Product from "../Models/Product.js";

export async function updateItems() {
  try {
    const actualItems = await storefront.fetchShopifyProducts();
    const localItems = await Product.find().lean();

    for (const id of actualItems) {
      let exist = localItems.find((item) => {
        const itemId = item.productId;
        return itemId == id;
      });

      if (exist) continue;

      const newProduct = new Product({ productId: id });
      await newProduct.save();
      await delay(350);
    }

    return actualItems;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
}

export function startBackgroundTask(fn, ms) {
  (async () => {
    while (true) {
      let timeNow = getBGTime();
      console.log(timeNow + `Function : ${fn.name} has started!`);
      const success = await fn();
      if (success) {
        timeNow = getBGTime();
        console.log(timeNow + `Function : ${fn.name} has ended!`);
      }
      await delay(ms);
    }
  })();
}
