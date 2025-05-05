import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faInstagram, 
  faLinkedinIn 
} from "@fortawesome/free-brands-svg-icons"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Newsletter Section */}
        <div className="footer-section">
          <h3>BE THE FIRST TO KNOW</h3>
          <p>Sign up for updates from mettā muse.</p>
          <form className="newsletter-form">
            <Input 
              type="email" 
              placeholder="Enter your e-mail..." 
              className="newsletter-input"
            />
            <Button type="submit" className="newsletter-button">
              SUBSCRIBE
            </Button>
          </form>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>CONTACT US</h3>
          <p>+44 221 133 5360</p>
          <p>customercare@mettamuse.com</p>
          <div className="currency-selector mt-6">
            <h3>CURRENCY</h3>
            <div className="flex items-center gap-2 mt-2">
              <Image src="/images/us-flag.svg" alt="US Flag" width={24} height={16} />
              <span>USD</span>
            </div>
            <p className="text-sm mt-2">Transactions will be completed in Euros and a currency reference is available on hover.</p>
          </div>
        </div>

        {/* mettā muse Links */}
        <div className="footer-section">
          <h3>mettā muse</h3>
          <ul className="footer-links">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/stories">Stories</Link></li>
            <li><Link href="/artisans">Artisans</Link></li>
            <li><Link href="/boutiques">Boutiques</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/eu-compliance">EU Compliances Docs</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>QUICK LINKS</h3>
          <ul className="footer-links">
            <li><Link href="/orders-shipping">Orders & Shipping</Link></li>
            <li><Link href="/seller-login">Join/Login as a Seller</Link></li>
            <li><Link href="/payment">Payment & Pricing</Link></li>
            <li><Link href="/returns">Return & Refunds</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="footer-section">
          <h3>FOLLOW US</h3>
          <div className="social-icons">
            <Link href="#" className="social-icon">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="#" className="social-icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </Link>
          </div>

          <h3 className="mt-6">mettā muse ACCEPTS</h3>
          <div className="payment-methods">
            {['gpay', 'mastercard', 'paypal', 'amex', 'applepay', 'shopify'].map((method) => (
              <div key={method} className="payment-icon">
                <Image 
                  src={`/images/${method}.svg`} 
                  alt={method} 
                  width={40} 
                  height={25}
                  className="object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} mettamuse. All rights reserved.</p>
      </div>
    </footer>
  )
}
