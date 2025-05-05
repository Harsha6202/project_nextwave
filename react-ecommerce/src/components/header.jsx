import { Link } from 'react-router-dom';
import { useTheme } from './theme-provider';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">eCommerce</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
          <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary">
            Orders
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link
            to="/cart"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            🛒
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;