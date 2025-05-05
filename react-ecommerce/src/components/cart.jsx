import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';

const Cart = () => {
  const { items, removeItem, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/shop"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b py-4 last:border-0"
            >
              <div className="w-24 h-24 relative">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="object-cover w-full h-full rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-muted-foreground">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="border rounded px-2 py-1"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:opacity-70"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-primary text-primary-foreground px-6 py-2 rounded-md mt-6 hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;