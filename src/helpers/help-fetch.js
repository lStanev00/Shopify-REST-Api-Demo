import { configDotenv } from "dotenv";
configDotenv();

const storefrontDomain = `https://${process.env.SHOPIFY_STORE_DOMAIN}`;
export const storefront = {
  fetchShopifyProducts: async function () {
    const endpoint = `${storefrontDomain}/api/2023-10/graphql.json`;

const query = `{ products(first: 10) { edges { node { id title handle description images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } }`;


    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = (await res.json()).data.products.edges.map(
      (edge) => edge.node
    );
    const result = [];

    for (const product of json) {
      const id = product.id.replace(`gid://shopify/Product/`, ``);
      const slug = product.handle;
      result.push({itemId:id, slug:slug});
    }
    return result;
  },
  fetchProductByHandle: async function (handle) {
    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;

    const query = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
    });

    const { data } = await response.json();
    const product = data?.productByHandle;

    if (!product) return null;

    const variantNode = product.variants?.edges[0]?.node;
    const variantId = variantNode?.id?.split("/").pop();

    const result = {
      id: product.id.replace("gid://shopify/Product/", ""),
      title: product.title,
      description: product.description,
      slug: product.handle,
      price: variantNode?.price,
      variantId: variantId || null,
      media: product.images?.edges.map((edge) => edge.node.url) || [],
    };

    return result;
  },
};
