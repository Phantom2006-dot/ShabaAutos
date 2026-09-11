import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Heart,
  Scale,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Car,
  Compass,
  Ship,
  Sparkles,
  ShieldCheck,
  Plane,
  Calculator,
  Search,
  DollarSign,
  FileText,
  Clock,
  MessageSquare,
  Home,
  Calendar,
} from 'lucide-react';
import { ScreenId } from '../types';
import { ShabaAutosLogo } from './ShabaAutosLogo';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  savedCount: number;
  compareCount: number;
  isLoggedIn?: boolean;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  compareCount,
  isLoggedIn = false,
  mobileMenuOpen: externalMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;

  const setIsMenuOpen = (open: boolean) => {
    setInternalMenuOpen(open);
    if (!open && onCloseMobileMenu) {
      onCloseMobileMenu();
    } else if (open && onToggleMobileMenu) {
      onToggleMobileMenu();
    } else if (!open && onToggleMobileMenu && externalMenuOpen) {
      onToggleMobileMenu();
    }
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD'>('NGN');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleToggleDropdown = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleNavClick = (screenId: ScreenId) => {
    onNavigate(screenId);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const toggleMobileSubmenu = (menuName: string) => {
    setMobileExpanded(mobileExpanded === menuName ? null : menuName);
  };

  const handleDrawerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavClick('buy-cars');
  };

  return (
    <header className="shabaautos-navbar" ref={navContainerRef}>
      <div className="shabaautos-navbar-inner">
        {/* Brand Logo */}
        <div
          className="shabaautos-brand cursor-pointer select-none"
          onClick={() => handleNavClick('home')}
          role="button"
          tabIndex={0}
          aria-label="ShabaAutos Home"
        >
          <div className="hidden sm:block">
            <ShabaAutosLogo size="md" showDivider={true} />
          </div>
          <div className="block sm:hidden">
            <ShabaAutosLogo size="sm" showDivider={true} />
          </div>
        </div>

        {/* Primary Desktop Navigation with Custom Dropdowns */}
        <nav className="shabaautos-nav hidden lg:flex items-stretch" aria-label="Primary navigation">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`shabaautos-nav-link ${currentScreen === 'home' ? 'active' : ''}`}
          >
            Home
            {currentScreen === 'home' && <span className="shabaautos-nav-indicator" />}
          </button>

          {/* Buy Cars Dropdown */}
          <div
            className="shabaautos-dropdown"
            onMouseEnter={() => handleMouseEnter('buy')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('buy-cars')}
              className={`shabaautos-nav-link gap-1 ${
                currentScreen === 'buy-cars' ||
                currentScreen === 'car-details' ||
                currentScreen === 'car-details-rav4'
                  ? 'active'
                  : ''
              }`}
              aria-expanded={activeDropdown === 'buy'}
            >
              <span>Buy Cars</span>
              <span
                onClick={(e) => handleToggleDropdown('buy', e)}
                className="p-0.5 rounded hover:bg-emerald-100/50 cursor-pointer"
                title="Toggle Buy Cars Menu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 text-[#12492f] ${
                    activeDropdown === 'buy' ? 'rotate-180' : ''
                  }`}
                />
              </span>
              {(currentScreen === 'buy-cars' ||
                currentScreen === 'car-details' ||
                currentScreen === 'car-details-rav4') && (
                <span className="shabaautos-nav-indicator" />
              )}
            </button>

            {activeDropdown === 'buy' && (
              <div className="shabaautos-dropdown-panel w-[320px]">
                <div className="px-3 py-2 border-b border-[#e4e9e3] mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#12492f] uppercase tracking-wider">
                    Verified Car Inventory
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.5 rounded">
                    56 Available
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick('buy-cars')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Car size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">All Available Cars</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Browse full inventory with 150-point inspection
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('car-details-rav4')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Compass size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">SUVs & Crossovers</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        RAV4, Lexus RX 350, Mercedes GLE 450
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('car-details')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Sparkles size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Sedans & Luxury Saloons</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Toyota Camry, Corolla, Mercedes C-Class
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-[#e4e9e3] pt-1 mt-1">
                    <button
                      onClick={() => handleNavClick('saved-compare')}
                      className="shabaautos-dropdown-item text-[#12492f] font-bold justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Scale size={14} /> Compare Vehicles
                      </span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rent a Car Dropdown */}
          <div
            className="shabaautos-dropdown"
            onMouseEnter={() => handleMouseEnter('rent')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('rent-car')}
              className={`shabaautos-nav-link gap-1 ${currentScreen === 'rent-car' ? 'active' : ''}`}
              aria-expanded={activeDropdown === 'rent'}
            >
              <span>Rent a Car</span>
              <span
                onClick={(e) => handleToggleDropdown('rent', e)}
                className="p-0.5 rounded hover:bg-emerald-100/50 cursor-pointer"
                title="Toggle Rent Menu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 text-[#12492f] ${
                    activeDropdown === 'rent' ? 'rotate-180' : ''
                  }`}
                />
              </span>
              {currentScreen === 'rent-car' && <span className="shabaautos-nav-indicator" />}
            </button>

            {activeDropdown === 'rent' && (
              <div className="shabaautos-dropdown-panel w-[300px]">
                <div className="px-3 py-2 border-b border-[#e4e9e3] mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#12492f] uppercase tracking-wider">
                    Rental Fleet & VIP
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.5 rounded">
                    Lagos & Abuja
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick('rent-car')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Car size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Daily & Weekly Self-Drive</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Clean, fueled sedans and SUVs
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('rent-car')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Plane size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Airport Fast-Track Pickups</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        LOS Murtala Muhammed & ABV Nnamdi Azikiwe
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('rent-car')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <ShieldCheck size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Chauffeur & Armed Escort</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        VIP executive protection & convoys
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Import from US Dropdown */}
          <div
            className="shabaautos-dropdown"
            onMouseEnter={() => handleMouseEnter('import')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('import-landing')}
              className={`shabaautos-nav-link gap-1 ${
                currentScreen === 'import-landing' || currentScreen === 'import-form'
                  ? 'active'
                  : ''
              }`}
              aria-expanded={activeDropdown === 'import'}
            >
              <span>Import from US</span>
              <span
                onClick={(e) => handleToggleDropdown('import', e)}
                className="p-0.5 rounded hover:bg-emerald-100/50 cursor-pointer"
                title="Toggle Import Menu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 text-[#12492f] ${
                    activeDropdown === 'import' ? 'rotate-180' : ''
                  }`}
                />
              </span>
              {(currentScreen === 'import-landing' || currentScreen === 'import-form') && (
                <span className="shabaautos-nav-indicator" />
              )}
            </button>

            {activeDropdown === 'import' && (
              <div className="shabaautos-dropdown-panel w-[320px]">
                <div className="px-3 py-2 border-b border-[#e4e9e3] mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#12492f] uppercase tracking-wider">
                    Direct USA Car Import
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.5 rounded">
                    Lagos Port Delivery
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick('import-landing')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Ship size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Import Overview</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Copart & Manheim direct to Tin Can port
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('import-landing')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Calculator size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Duty & Cost Calculator</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Instant calculation of customs & shipping
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('import-form')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Start Import Wizard</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Submit vehicle specifications for bid
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-[#e4e9e3] pt-1 mt-1">
                    <button
                      onClick={() => handleNavClick('order-tracking')}
                      className="shabaautos-dropdown-item text-[#12492f] font-bold justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Clock size={14} /> Track Existing Order (SA-IMP-00078)
                      </span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services Dropdown (Sell Your Car & Find a Car) */}
          <div
            className="shabaautos-dropdown"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleNavClick('sell-car')}
              className={`shabaautos-nav-link gap-1 ${
                currentScreen === 'sell-car' || currentScreen === 'find-car' ? 'active' : ''
              }`}
              aria-expanded={activeDropdown === 'services'}
            >
              <span>Services</span>
              <span
                onClick={(e) => handleToggleDropdown('services', e)}
                className="p-0.5 rounded hover:bg-emerald-100/50 cursor-pointer"
                title="Toggle Services Menu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 text-[#12492f] ${
                    activeDropdown === 'services' ? 'rotate-180' : ''
                  }`}
                />
              </span>
              {(currentScreen === 'sell-car' || currentScreen === 'find-car') && (
                <span className="shabaautos-nav-indicator" />
              )}
            </button>

            {activeDropdown === 'services' && (
              <div className="shabaautos-dropdown-panel w-[280px]">
                <div className="px-3 py-2 border-b border-[#e4e9e3] mb-1.5">
                  <span className="text-[11px] font-bold text-[#12492f] uppercase tracking-wider">
                    Auto Concierge & Selling
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick('sell-car')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <DollarSign size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Sell Your Car</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Free inspection & instant payout
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavClick('find-car')}
                    className="shabaautos-dropdown-item group"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#158047] flex items-center justify-center shrink-0 group-hover:bg-[#12492f] group-hover:text-white transition-colors">
                      <Search size={15} />
                    </div>
                    <div>
                      <div className="font-bold text-[#26372c]">Find a Car for Me</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        Let experts source your dream car
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Header Contact, Saved Wishlist & Sign In / Account Dropdown */}
        <div className="shabaautos-header-contact hidden lg:flex items-center">
          {/* Phone Contact */}
          <a
            href="tel:+2348123456789"
            className="shabaautos-contact-btn"
            title="Call +234 812 345 6789"
          >
            <Phone size={13} className="text-[#158047]" />
            <span className="hidden xl:inline">+234 812 345 6789</span>
            <span className="inline xl:hidden text-[11px] font-bold">Call</span>
          </a>

          {/* Wishlist Button */}
          <button
            className="shabaautos-badge-btn"
            onClick={() => handleNavClick('saved-compare')}
            title="View Saved Wishlist"
          >
            <Heart size={14} className={savedCount > 0 ? 'text-[#12492f] fill-[#12492f]/10' : ''} />
            <span className="hidden xl:inline">Wishlist</span>
            <b className="shabaautos-badge-count">{savedCount}</b>
          </button>

          {/* Compare Button */}
          <button
            className="shabaautos-badge-btn"
            onClick={() => handleNavClick('saved-compare')}
            title="Compare Vehicles"
          >
            <Scale size={14} />
            <span className="hidden xl:inline">Compare</span>
            <b className="shabaautos-badge-count">{compareCount}</b>
          </button>

          {/* User Sign In / Profile with Dropdown */}
          <div
            className="shabaautos-dropdown"
            onMouseEnter={() => handleMouseEnter('account')}
            onMouseLeave={handleMouseLeave}
          >
            {isLoggedIn ? (
              <button
                onClick={(e) => handleToggleDropdown('account', e)}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border border-emerald-300 hover:border-[#12492f] bg-white transition-all shadow-2xs cursor-pointer"
                title="Your Account"
                aria-expanded={activeDropdown === 'account'}
              >
                <div className="w-5 h-5 rounded-full bg-[#12492f] text-white flex items-center justify-center text-[9px] font-bold">
                  OA
                </div>
                <span className="text-[11px] font-semibold text-[#12492f] hidden sm:inline">Oluwasegun</span>
                <ChevronDown size={11} className="text-[#12492f]" />
              </button>
            ) : (
              <button
                className="shabaautos-signin flex items-center justify-center gap-1 cursor-pointer"
                onClick={(e) => handleToggleDropdown('account', e)}
                aria-expanded={activeDropdown === 'account'}
              >
                <span>Sign In</span>
                <ChevronDown size={11} />
              </button>
            )}

            {/* Account Dropdown Panel */}
            {activeDropdown === 'account' && (
              <div className="shabaautos-dropdown-panel right-0 left-auto w-[240px]">
                <div className="px-3 py-2 border-b border-[#e4e9e3] mb-1">
                  <div className="text-xs font-bold text-[#12492f]">
                    {isLoggedIn ? 'Oluwasegun Adeleke' : 'Welcome to ShabaAutos'}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isLoggedIn ? 'Customer ID: SA-CUST-441' : 'Manage cars, orders & wishlist'}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick('order-tracking')}
                    className="shabaautos-dropdown-item"
                  >
                    <Clock size={14} className="text-[#158047]" />
                    <span>Track Order (SA-IMP-00078)</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('saved-compare')}
                    className="shabaautos-dropdown-item justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart size={14} className="text-[#158047]" />
                      <span>Saved Vehicles</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.2 rounded">
                      {savedCount}
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavClick('saved-compare')}
                    className="shabaautos-dropdown-item justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <Scale size={14} className="text-[#158047]" />
                      <span>Compare List</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.2 rounded">
                      {compareCount}
                    </span>
                  </button>

                  <div className="border-t border-[#e4e9e3] pt-1 mt-1">
                    <button
                      onClick={() => handleNavClick('auth')}
                      className="shabaautos-dropdown-item font-bold text-[#12492f]"
                    >
                      <User size={14} />
                      <span>{isLoggedIn ? 'Account Profile' : 'Sign In / Register'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tablet Navigation Controls (768px - 1023px) */}
        <div className="hidden md:flex lg:hidden items-center gap-2 ml-auto">
          <a
            href="tel:+2348123456789"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#12492f] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors min-h-[44px]"
            aria-label="Call ShabaAutos Hotline"
          >
            <Phone size={14} className="text-[#158047]" />
            <span className="text-[11px]">Hotline</span>
          </a>

          <button
            onClick={() => handleNavClick('saved-compare')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#12492f] bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg transition-colors relative cursor-pointer min-h-[44px]"
            aria-label="Saved Cars"
          >
            <Heart size={15} className={savedCount > 0 ? 'fill-[#12492f]/20' : ''} />
            <span className="text-[11px]">Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 bg-[#12492f] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('saved-compare')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#12492f] bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg transition-colors cursor-pointer min-h-[44px]"
            aria-label="Compare List"
          >
            <Scale size={15} />
            <span className="text-[11px]">Compare</span>
            {compareCount > 0 && (
              <span className="w-4 h-4 bg-[#12492f] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#12492f] border border-emerald-300 hover:border-[#12492f] rounded-lg transition-colors cursor-pointer bg-white min-h-[44px]"
            aria-label="Account Login"
          >
            <User size={14} />
            <span className="text-[11px]">{isLoggedIn ? 'Account' : 'Sign In'}</span>
          </button>

          {/* Tablet Drawer Button */}
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 text-white bg-[#12492f] hover:bg-[#0e3b26] rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95 min-h-[44px]"
            aria-label={isMenuOpen ? 'Close navigation directory' : 'Open navigation directory'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="text-[11px] font-bold uppercase tracking-wider">Directory</span>
          </button>
        </div>

        {/* Mobile Navigation Controls (< 768px) */}
        <div className="flex md:hidden items-center gap-1.5 ml-auto">
          <a
            href="https://wa.me/2348123456789"
            target="_blank"
            rel="noreferrer"
            className="w-11 h-11 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Chat on WhatsApp"
          >
            <MessageSquare size={18} />
          </a>

          <a
            href="tel:+2348123456789"
            className="w-11 h-11 text-[#12492f] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Call ShabaAutos Hotline"
          >
            <Phone size={18} />
          </a>

          <button
            onClick={() => handleNavClick('saved-compare')}
            className="w-11 h-11 text-[#12492f] rounded-xl hover:bg-emerald-50 transition-colors relative cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Saved Cars"
          >
            <Heart size={19} className={savedCount > 0 ? 'fill-[#12492f]/20' : ''} />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className="w-11 h-11 text-[#12492f] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs shrink-0"
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Tablet Dedicated Navigation Strip (768px - 1023px) */}
      <nav
        className="hidden md:flex lg:hidden bg-white/95 border-t border-[#e8ece7] px-4 py-1.5 items-center justify-between shadow-2xs backdrop-blur-md"
        aria-label="Tablet sub-navigation"
      >
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 w-full">
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'home'
                ? 'bg-[#12492f] text-white shadow-xs'
                : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
            }`}
          >
            <Home size={13} />
            <span>Home</span>
          </button>

          {/* Buy Cars with Tablet Dropdown */}
          <div className="relative shrink-0">
            <div
              className={`flex items-center rounded-lg text-xs font-bold transition-all ${
                currentScreen === 'buy-cars' || currentScreen === 'car-details' || currentScreen === 'car-details-rav4'
                  ? 'bg-[#12492f] text-white shadow-xs'
                  : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
              }`}
            >
              <button
                onClick={() => handleNavClick('buy-cars')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer"
              >
                <Car size={13} />
                <span>Buy Cars</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-black ${
                    currentScreen === 'buy-cars' || currentScreen === 'car-details' || currentScreen === 'car-details-rav4'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 text-[#12492f]'
                  }`}
                >
                  56
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => handleToggleDropdown('tablet-buy', e)}
                className="pr-2 pl-0.5 py-1.5 cursor-pointer hover:opacity-80"
                aria-label="Toggle Buy Cars submenu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'tablet-buy' ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {activeDropdown === 'tablet-buy' && (
              <div className="absolute top-full left-0 mt-1.5 w-[270px] bg-white rounded-xl shadow-xl border border-[#e4e9e3] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleNavClick('buy-cars')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Car size={14} className="text-[#158047]" /> All 56 Verified Cars</span>
                  <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-1.5 py-0.5 rounded">All</span>
                </button>
                <button
                  onClick={() => handleNavClick('car-details-rav4')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Compass size={14} className="text-[#158047]" />
                  <span>SUVs & Crossovers (RAV4, Lexus RX)</span>
                </button>
                <button
                  onClick={() => handleNavClick('car-details')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-[#158047]" />
                  <span>Sedans & Luxury (Camry, C-Class)</span>
                </button>
              </div>
            )}
          </div>

          {/* Rent a Car with Tablet Dropdown */}
          <div className="relative shrink-0">
            <div
              className={`flex items-center rounded-lg text-xs font-bold transition-all ${
                currentScreen === 'rent-car'
                  ? 'bg-[#12492f] text-white shadow-xs'
                  : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
              }`}
            >
              <button
                onClick={() => handleNavClick('rent-car')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer"
              >
                <Calendar size={13} />
                <span>Rent a Car</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleToggleDropdown('tablet-rent', e)}
                className="pr-2 pl-0.5 py-1.5 cursor-pointer hover:opacity-80"
                aria-label="Toggle Rent a Car submenu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'tablet-rent' ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {activeDropdown === 'tablet-rent' && (
              <div className="absolute top-full left-0 mt-1.5 w-[260px] bg-white rounded-xl shadow-xl border border-[#e4e9e3] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleNavClick('rent-car')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Car size={14} className="text-[#158047]" />
                  <span>Daily & Weekly Self-Drive</span>
                </button>
                <button
                  onClick={() => handleNavClick('rent-car')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Plane size={14} className="text-[#158047]" />
                  <span>Airport Fast-Track Pickups</span>
                </button>
                <button
                  onClick={() => handleNavClick('rent-car')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <ShieldCheck size={14} className="text-[#158047]" />
                  <span>Chauffeur & Armed Escort</span>
                </button>
              </div>
            )}
          </div>

          {/* Import from US with Tablet Dropdown */}
          <div className="relative shrink-0">
            <div
              className={`flex items-center rounded-lg text-xs font-bold transition-all ${
                currentScreen === 'import-landing' || currentScreen === 'import-form'
                  ? 'bg-[#12492f] text-white shadow-xs'
                  : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
              }`}
            >
              <button
                onClick={() => handleNavClick('import-landing')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer"
              >
                <Ship size={13} />
                <span>Import US</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleToggleDropdown('tablet-import', e)}
                className="pr-2 pl-0.5 py-1.5 cursor-pointer hover:opacity-80"
                aria-label="Toggle Import submenu"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    activeDropdown === 'tablet-import' ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {activeDropdown === 'tablet-import' && (
              <div className="absolute top-full left-0 mt-1.5 w-[270px] bg-white rounded-xl shadow-xl border border-[#e4e9e3] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => handleNavClick('import-landing')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Ship size={14} className="text-[#158047]" />
                  <span>Direct Import Overview</span>
                </button>
                <button
                  onClick={() => handleNavClick('import-landing')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <Calculator size={14} className="text-[#158047]" />
                  <span>Customs & Duty Calculator</span>
                </button>
                <button
                  onClick={() => handleNavClick('import-form')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-[#12492f] rounded-lg flex items-center gap-2"
                >
                  <FileText size={14} className="text-[#158047]" />
                  <span>Start Import Wizard</span>
                </button>
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => handleNavClick('order-tracking')}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#12492f] hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                  >
                    <Clock size={14} />
                    <span>Track Active Order (SA-IMP-00078)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sell Your Car */}
          <button
            onClick={() => handleNavClick('sell-car')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'sell-car'
                ? 'bg-[#12492f] text-white shadow-xs'
                : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
            }`}
          >
            <DollarSign size={13} />
            <span>Sell Car</span>
          </button>

          {/* Car Finder */}
          <button
            onClick={() => handleNavClick('find-car')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'find-car'
                ? 'bg-[#12492f] text-white shadow-xs'
                : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
            }`}
          >
            <Search size={13} />
            <span>Car Finder</span>
          </button>

          {/* Live Order Tracking */}
          <button
            onClick={() => handleNavClick('order-tracking')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentScreen === 'order-tracking'
                ? 'bg-[#12492f] text-white shadow-xs'
                : 'text-[#26372c] hover:bg-emerald-50 hover:text-[#12492f]'
            }`}
          >
            <Clock size={13} />
            <span>Track Order</span>
          </button>
        </div>
      </nav>

      {/* Comprehensive Slide-Out Navigation Drawer for Mobile & Tablet */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Directory"
            className="relative z-10 w-full max-w-[380px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfa]">
              <div
                className="cursor-pointer select-none"
                onClick={() => handleNavClick('home')}
              >
                <ShabaAutosLogo size="sm" showDivider={true} />
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Search & Currency Bar */}
            <div className="p-4 bg-gray-50/80 border-b border-gray-100 space-y-2.5">
              <form onSubmit={handleDrawerSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars, makes, models, VIN..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#12492f] transition-all font-medium text-gray-800 placeholder-gray-400 shadow-2xs"
                />
                <Search size={15} className="absolute left-3 top-3 text-gray-400" />
              </form>

              {/* Currency & Quick Actions Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('NGN')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedCurrency === 'NGN'
                        ? 'bg-[#12492f] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ₦ NGN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USD')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedCurrency === 'USD'
                        ? 'bg-[#12492f] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    $ USD
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('saved-compare')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#12492f] cursor-pointer"
                  >
                    <Heart size={12} className="text-emerald-700" />
                    <span>Saved ({savedCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('saved-compare')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 hover:border-[#12492f] cursor-pointer"
                  >
                    <Scale size={12} className="text-emerald-700" />
                    <span>Compare ({compareCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Navigation 4-Card Grid */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Primary Services
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleNavClick('buy-cars')}
                    className="p-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#12492f] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Car size={16} />
                    </div>
                    <div className="text-xs font-bold text-gray-900">Buy a Car</div>
                    <div className="text-[10px] text-gray-500">56+ verified cars</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('rent-car')}
                    className="p-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#12492f] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Plane size={16} />
                    </div>
                    <div className="text-xs font-bold text-gray-900">Rent a Car</div>
                    <div className="text-[10px] text-gray-500">Lagos & Abuja fleet</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('import-landing')}
                    className="p-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#12492f] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <Ship size={16} />
                    </div>
                    <div className="text-xs font-bold text-gray-900">Import US</div>
                    <div className="text-[10px] text-gray-500">Copart & Manheim</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('sell-car')}
                    className="p-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl border border-emerald-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#12492f] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                      <DollarSign size={16} />
                    </div>
                    <div className="text-xs font-bold text-gray-900">Sell Car</div>
                    <div className="text-[10px] text-gray-500">Instant cash offer</div>
                  </button>
                </div>
              </div>

              {/* Detailed Navigation List with Accordions */}
              <div className="space-y-1 pt-2 border-t border-gray-100">
                {/* Home */}
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentScreen === 'home'
                      ? 'bg-emerald-100/80 text-[#12492f]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles size={15} className="text-emerald-700" />
                    Home Overview
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>

                {/* Buy Cars Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('buy')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Car size={15} className="text-emerald-700" />
                      Buy Verified Vehicles
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 text-gray-500 ${
                        mobileExpanded === 'buy' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded === 'buy' && (
                    <div className="ml-5 pl-3 border-l-2 border-emerald-200 space-y-1 py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('buy-cars')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • All Inventory (56+ Cars)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('car-details-rav4')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • SUVs & Crossovers (Toyota, Lexus, Benz)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('car-details')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Sedans & Luxury Saloons
                      </button>
                    </div>
                  )}
                </div>

                {/* Rent a Car Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('rent')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Plane size={15} className="text-emerald-700" />
                      Rent a Car
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 text-gray-500 ${
                        mobileExpanded === 'rent' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded === 'rent' && (
                    <div className="ml-5 pl-3 border-l-2 border-emerald-200 space-y-1 py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('rent-car')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Daily & Weekly Self-Drive
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('rent-car')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Airport Transfers (Lagos & Abuja)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('rent-car')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Chauffeur & VIP Armed Escort
                      </button>
                    </div>
                  )}
                </div>

                {/* Import from US Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleMobileSubmenu('import')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Ship size={15} className="text-emerald-700" />
                      Import from USA
                    </span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 text-gray-500 ${
                        mobileExpanded === 'import' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded === 'import' && (
                    <div className="ml-5 pl-3 border-l-2 border-emerald-200 space-y-1 py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('import-landing')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Import Overview & Process
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('import-landing')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Customs Duty & Clearing Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('import-form')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-gray-600 hover:text-[#12492f] block cursor-pointer"
                      >
                        • Start 4-Step Import Wizard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavClick('order-tracking')}
                        className="w-full text-left py-1.5 text-xs font-semibold text-emerald-800 font-bold block cursor-pointer"
                      >
                        • Track Order (SA-IMP-00078)
                      </button>
                    </div>
                  )}
                </div>

                {/* Sell Your Car */}
                <button
                  type="button"
                  onClick={() => handleNavClick('sell-car')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentScreen === 'sell-car'
                      ? 'bg-emerald-100/80 text-[#12492f]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <DollarSign size={15} className="text-emerald-700" />
                    Sell Your Car (Instant Cash)
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>

                {/* Find a Car for Me (Concierge) */}
                <button
                  type="button"
                  onClick={() => handleNavClick('find-car')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentScreen === 'find-car'
                      ? 'bg-emerald-100/80 text-[#12492f]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Search size={15} className="text-emerald-700" />
                    Find a Car for Me (Concierge)
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>

                {/* Live Order Tracking */}
                <button
                  type="button"
                  onClick={() => handleNavClick('order-tracking')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentScreen === 'order-tracking'
                      ? 'bg-emerald-100/80 text-[#12492f]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Clock size={15} className="text-emerald-700" />
                    Live Ocean AIS Tracking
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-[#12492f] font-bold px-2 py-0.5 rounded-full">
                    GPS Active
                  </span>
                </button>

                {/* Saved & Compare */}
                <button
                  type="button"
                  onClick={() => handleNavClick('saved-compare')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    currentScreen === 'saved-compare'
                      ? 'bg-emerald-100/80 text-[#12492f]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={15} className="text-emerald-700" />
                    Saved Vehicles & Comparison
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                    {savedCount} saved
                  </span>
                </button>
              </div>

              {/* Account Card & Support Direct Links */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {/* Account Profile / Login button */}
                <button
                  type="button"
                  onClick={() => handleNavClick('auth')}
                  className="w-full p-3 bg-[#12492f] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <User size={15} />
                  <span>{isLoggedIn ? 'Account (Oluwasegun)' : 'Sign In / Register Account'}</span>
                </button>

                {/* 24/7 WhatsApp Chat button */}
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-[#12492f] text-xs font-bold rounded-xl flex items-center justify-between border border-emerald-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={15} className="text-emerald-700" />
                    Chat on WhatsApp (24/7 Support)
                  </span>
                  <ChevronRight size={14} className="text-emerald-700" />
                </a>

                {/* Direct Phone Call */}
                <a
                  href="tel:+2348123456789"
                  className="w-full py-2.5 px-3.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-between border border-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={15} className="text-gray-600" />
                    Direct Hotline: +234 812 345 6789
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-[11px] text-gray-500 font-medium">
              ShabaAutos Nigeria Ltd • Tin Can Island Port, Lagos
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
