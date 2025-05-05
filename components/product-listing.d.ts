import React from "react";

interface ProductListingProps {
  initialProducts: any[];
  categories: string[];
  user: any;
}

declare const ProductListing: React.FC<ProductListingProps>;

export default ProductListing;
