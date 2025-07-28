import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Search, Calendar, Clock, Phone, Menu, X, Home, Map, Compass, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Changed this line
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isAdminPage, setIsAdminPage] = useState(false);

  const { t } = useTranslation(); // Changed this line

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  interface NavLinkProps {
    to: string;
    icon: React.ComponentType<any>;
    children?: React.ReactNode;
    translationKey: string;
  }

  const NavLink = ({ to, icon: Icon, children, translationKey }: NavLinkProps) => {
    const isScrollLink = isHomePage && to === '#check-status';
    const linkText = translationKey ? t(translationKey) : children;

    if (isScrollLink) {
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ScrollLink
            to="check-status"
            smooth={true}
            duration={500}
            className="flex items-center space-x-2 hover:text-blue-200 transition-colors cursor-pointer p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon className="h-5 w-5" />
            <span>{linkText}</span>
          </ScrollLink>
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to={to} 
          className="flex items-center space-x-2 hover:text-blue-200 transition-colors p-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Icon className="h-5 w-5" />
          <span>{linkText}</span>
        </Link>
      </motion.div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-900 dark:bg-gray-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/logo.png" 
                alt="Avio Track Logo" 
                className="h-12 w-auto"
              />
              <div>
                <span className="text-2xl font-bold">Avio Track</span>
                <p className="text-xs text-blue-200 dark:text-blue-400">
                  {t('navbar.tagline')}
                </p>
              </div>
            </Link>
          </motion.div>

          {!isAdminPage && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:flex items-center space-x-1"
              >
                <div className="flex items-center space-x-1">
                  <NavLink to="/" icon={Home} translationKey="navbar.home" />
                  <NavLink to="#check-status" icon={Search} translationKey="navbar.flightStatus" />
                  <NavLink to="/book" icon={Calendar} translationKey="navbar.book" />
                  <NavLink to="/schedule" icon={Clock} translationKey="navbar.schedule" />
                </div>

                <div className="h-6 w-px bg-blue-800 mx-2"></div>

                <div className="flex items-center space-x-1">
                  <NavLink to="/travel-guide" icon={Compass} translationKey="navbar.guide" />
                  <NavLink to="/vacation-counselor" icon={Map} translationKey="navbar.plan" />
                  <NavLink to="/contact" icon={Phone} translationKey="navbar.contact" />
                </div>

                <div className="h-6 w-px bg-blue-800 mx-2"></div>

                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-md hover:bg-blue-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && !isAdminPage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-20 bg-blue-900 dark:bg-gray-900 z-50"
          >
            <div className="px-4 pt-2 pb-3 space-y-4">
              <NavLink to="/" icon={Home} translationKey="navbar.home" />
              <NavLink to="#check-status" icon={Search} translationKey="navbar.flightStatus" />
              <NavLink to="/book" icon={Calendar} translationKey="navbar.book" />
              <NavLink to="/schedule" icon={Clock} translationKey="navbar.schedule" />
              <NavLink to="/travel-guide" icon={Compass} translationKey="navbar.guide" />
              <NavLink to="/vacation-counselor" icon={Map} translationKey="navbar.plan" />
              <NavLink to="/contact" icon={Phone} translationKey="navbar.contact" />
              <div className="flex items-center space-x-4 pt-4">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-blue-800 dark:bg-blue-800 py-2 text-center text-sm">
        <p className="text-white">
          {t('navbar.ctaBanner')}{' '}
          <Link to="/vacation-counselor" className="underline hover:text-blue-200">
            {t('navbar.getStarted')}
          </Link>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;