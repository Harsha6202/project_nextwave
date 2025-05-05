import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../contexts/cart-context';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-pulse bg-muted aspect-square rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-muted h-8 w-2/3 rounded"></div>
            <div className="bg-muted h-6 w-1/4 rounded"></div>
            <div className="bg-muted h-24 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          <p>Error loading product details. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>
          <div className="prose max-w-none mb-6">
            <p>{product.description}</p>
          </div>
          <button
            className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            onClick={() => addItem(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;