import React from "react";

interface ProductDetailsProps {
  product: any;
  relatedProducts: any[];
  user: any;
}

declare const ProductDetails: React.FC<ProductDetailsProps>;

export default ProductDetails;
