import { configDotenv } from "dotenv";
configDotenv();

const storefrontDomain = `https://${process.env.SHOPIFY_STORE_DOMAIN}`;
export const storefront = {
  fetchShopifyProducts: async function () {
    const endpoint = `${storefrontDomain}/api/2023-10/graphql.json`;

    const query = `
        {
          products(first: 10) {
            edges {
              node {
                id
                title
                description
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
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
    `;

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
      result.push(id);
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

    const json = await response.json();

    const result = {
      id: json?.id.replace(`gid://shopify/Product/`, ``),
      title: json?.title,
      description: json?.description,
      slug: json?.handle,
      price: json?.variants?.edges[0]?.node?.price,

    }
    return result || null;
  },
};
