import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const ProductListing = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-lg mb-2"></div>
              <div className="bg-muted h-4 w-2/3 rounded mb-2"></div>
              <div className="bg-muted h-4 w-1/3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          <p>Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="aspect-square relative">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                <p className="text-muted-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;