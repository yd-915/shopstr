import React from "react";
import { productData } from "./utility/product-parser-functions";
import { Divider } from "@nextui-org/react";
import ProductCard from "./utility-components/product-card";
import CheckoutCard from "./checkout-card";

export default function CheckoutPage({
  productData,
}: {
  productData: productData;
}) {
  if (!productData) return null;
  const {
    createdAt,
    title,
    summary,
    publishedAt,
    images,
    categories,
    location,
    price,
    currency,
    shippingType,
    shippingCost,
    totalCost,
  } = productData;

  const checkoutDisplay = () => {
    return (
      <div className="flex flex-col w-full items-center">
        <Divider />
        <CheckoutCard productData={productData} />
      </div>
    );
  };
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col w-[50%] sm:w-full ">
        <ProductCard
          productData={productData}
          isCheckout
          footerContent={checkoutDisplay()}
        />
      </div>
    </div>
  );
}
