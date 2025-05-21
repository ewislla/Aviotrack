import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Avio Track Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">Avio Track</span>
            </Link>
            <p className="text-blue-200">Your trusted partner for flight tracking and booking services worldwide.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-200 hover:text-white">Home</Link></li>
              <li><Link to="/book" className="text-blue-200 hover:text-white">Book Flight</Link></li>
              <li><Link to="/status" className="text-blue-200 hover:text-white">Flight Status</Link></li>
              <li><Link to="/schedule" className="text-blue-200 hover:text-white">Flight Schedule</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-blue-200 hover:text-white">Contact Us</Link></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p className="text-blue-200">Mon - Fri: 9:00 AM - 8:00 PM</p>
              <p className="text-blue-200">Sat - Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; {new Date().getFullYear()} Avio Track. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;