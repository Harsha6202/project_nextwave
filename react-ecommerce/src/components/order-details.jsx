import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-8 w-1/4 rounded"></div>
          <div className="bg-muted h-32 rounded-lg"></div>
          <div className="bg-muted h-24 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">
          <p>Error loading order details. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link
            to="/orders"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/orders"
          className="text-primary hover:opacity-80"
        >
          ← Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-muted-foreground">
                Status: <span className="font-medium">{order.status}</span>
              </p>
            </div>
            
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="w-16 h-16 relative">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free'}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;