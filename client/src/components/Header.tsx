import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import catwalkFramesLogo from '@/assets/catwalk-frames-logo.png';

interface NavigationHandlers {
  howItWorks: () => void;
  benefits: () => void;
  testimonials: () => void;
  faq: () => void;
}

interface HeaderProps {
  navigationHandlers?: NavigationHandlers;
}

const Header = ({ navigationHandlers }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { key: "howItWorks", label: "How It Works" },
    { key: "benefits", label: "Benefits" },
    { key: "testimonials", label: "Testimonials" },
    { key: "faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#8B4A9C] shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-center">
              <img
                src={catwalkFramesLogo}
                alt="Catwalk Frames Estate & Management"
                className="h-16 w-auto max-w-[200px] object-contain"
              />
              <span className="text-white font-bold text-sm mt-1">SALES</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button 
                key={item.key}
                onClick={() => navigationHandlers?.[item.key as keyof NavigationHandlers]?.()} 
                className="font-medium text-white hover:text-[#F7EF81] transition cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <a 
              href="tel:01977285111" 
              className="hidden md:block bg-[#F7EF81] text-[#0E6BFF] px-4 py-2 rounded-md font-medium hover:bg-[#F7EF81]/90 transition"
            >
              Call Us: 01977 285 111
            </a>
            <Button
              variant="ghost"
              className="md:hidden text-white hover:text-[#F7EF81]" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn("px-4 py-3 bg-[#8B4A9C] border-t md:hidden", 
        mobileMenuOpen ? "block" : "hidden")}>
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => (
            <button 
              key={item.key}
              onClick={() => {
                navigationHandlers?.[item.key as keyof NavigationHandlers]?.();
                setMobileMenuOpen(false);
              }}
              className="font-medium text-white hover:text-[#F7EF81] transition text-left"
            >
              {item.label}
            </button>
          ))}
          <a 
            href="tel:01977285111" 
            className="bg-[#F7EF81] text-[#0E6BFF] px-4 py-2 rounded-md font-medium hover:bg-[#F7EF81]/90 transition text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Call Us: 01977 285 111
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
