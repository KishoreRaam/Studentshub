import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatorBadge } from './CreatorBadge';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/assets/b7928a19a6e3cea096b8484c46424ab74db082db.png" 
                alt="EduBuzz Logo" 
                className="h-10 w-auto bg-white rounded-lg p-1"
              />
              <span className="ml-3 text-xl">EduBuzz</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering students worldwide with exclusive benefits and premium tool access. Unlock your potential with EduBuzz.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/perks" className="text-gray-400 hover:text-white transition-colors duration-200">Benefits</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Login</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-white transition-colors duration-200">Resources</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Student Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API Documentation</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">support@edubuzz.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">7904734217</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <p className="text-gray-400">Address</p>
                  <p className="text-white">123 Education St.<br />Student City, SC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 EduBuzz. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Cookies</a>
            </div>
          </div>

          {/* Creator Badge - More prominent */}
          <div className="flex justify-center pt-6 pb-4">
            <CreatorBadge />
          </div>
        </div>
      </div>
    </footer>
  );
}