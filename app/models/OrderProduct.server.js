import invariant from "tiny-invariant";
import db from "../db.server";

export async function getOrder(id, graphql) {
  const order = await db.Order.findFirst({ where: { id } });

  if (!order) {
    return null;
  }

  return supplementOrder(order, graphql);
}

// async function getBookProduct(id, graphql) {
//     const bookProduct = await db
// }

// export async function getQRCodes(shop, graphql) {
//   const qrCodes = await db.qRCode.findMany({
//     where: { shop },
//     orderBy: { id: "desc" },
//   });

//   if (qrCodes.length === 0) return [];

//   return Promise.all(
//     qrCodes.map((qrCode) => supplementQRCode(qrCode, graphql))
//   );
// }

// export function getQRCodeImage(id) {
//   const url = new URL(`/qrcodes/${id}/scan`, process.env.SHOPIFY_APP_URL);
//   return qrcode.toDataURL(url.href);
// }

// export function getDestinationUrl(qrCode) {
//   if (qrCode.destination === "product") {
//     return `https://${qrCode.shop}/products/${qrCode.productHandle}`;
//   }

//   const match = /gid:\/\/shopify\/ProductVariant\/([0-9]+)/.exec(qrCode.productVariantId);
//   invariant(match, "Unrecognized product variant ID");

//   return `https://${qrCode.shop}/cart/${match[1]}:1`;
// }

async function supplementOrder(order, graphql) {
  const qrCodeImagePromise = getQRCodeImage(qrCode.id);

  const response = await graphql(
    `
      query supplementQRCode($id: ID!) {
        product(id: $id) {
          title
          images(first: 1) {
            nodes {
              altText
              url
            }
          }
        }
      }
    `,
    {
      variables: {
        id: qrCode.productId,
      },
    }
  );

  const {
    data: { product },
  } = await response.json();

  return {
    ...qrCode,
    productDeleted: !product?.title,
    productTitle: product?.title,
    productImage: product?.images?.nodes[0]?.url,
    productAlt: product?.images?.nodes[0]?.altText,
    destinationUrl: getDestinationUrl(qrCode),
    image: await qrCodeImagePromise,
  };
}

export function validateOrder(data) {
  const errors = {};

  if (!data.shipperZip) {
    errors.shipperZip = "ShipperZip is required";
  }

  if (!data.recipientZip) {
    errors.recipientZip = "RecipientZip is required";
  }

  if (!data.weight) {
    errors.weight = "Weight is required";
  }

  if (!data.large) {
    errors.large = "Large is required";
  }

  if (!data.width) {
    errors.width = "Width is required";
  }

  if (!data.height) {
    errors.height = "Height is required";
  }

  if (!data.content) {
    errors.content = "Content is required";
  }

  if (!data.shipperCountry) {
    errors.shipperCountry = "ShipperCountry is required";
  }

  if (!data.shipperState) {
    errors.shipperState = "ShipperState is required";
  }

  if (!data.shipperCity) {
    errors.shipperCity = "ShipperCity is required";
  }

  if (!data.recipientCountry) {
    errors.recipientCountry = "RecipientCountry is required";
  }

  if (!data.recipientState) {
    errors.recipientState = "RecipientState is required";
  }

  if (data.recipientCity) {
    errors.recipientCity = "RecipientCity is required";
  }

  if (!data.curriers || !data.curriers.length) {
    errors.curriers = "Product is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}