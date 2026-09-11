import React from 'react';
import {
  Home,
  Car,
  Calendar,
  Ship,
  Menu,
} from 'lucide-react';
import { ScreenId } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
  compareCount?: number;
  isLoggedIn?: boolean;
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  savedCount = 0,
  onOpenMenu,
}) => {
  // Tab mapping & active logic
  const isHomeActive = currentScreen === 'home';
  const isBuyActive =
    currentScreen === 'buy-cars' ||
    currentScreen === 'car-details' ||
    currentScreen === 'car-details-rav4';
  const isRentActive = currentScreen === 'rent-car';
  const isImportActive =
    currentScreen === 'import-landing' || currentScreen === 'import-form';

  const handleTabClick = (screen: ScreenId) => {
    onNavigate(screen);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]"
      aria-label="Mobile application bottom navigation"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            isHomeActive
              ? 'text-[#0e7c3a]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Go to Home"
        >
          <div className="relative">
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isHomeActive ? 'bg-emerald-100/70' : 'bg-transparent'
              }`}
            >
              <Home
                className={`w-5 h-5 transition-transform ${
                  isHomeActive ? 'stroke-[2.5px] scale-105 text-[#0e7c3a]' : 'stroke-2 text-slate-500'
                }`}
              />
            </div>
          </div>
          <span
            className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap ${
              isHomeActive ? 'font-black text-[#0e7c3a]' : 'font-semibold text-slate-500'
            }`}
          >
            Home
          </span>
        </button>

        {/* Tab 2: Buy Cars */}
        <button
          type="button"
          onClick={() => handleTabClick('buy-cars')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            isBuyActive
              ? 'text-[#0e7c3a]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Browse Cars for Sale"
        >
          <div className="relative">
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isBuyActive ? 'bg-emerald-100/70' : 'bg-transparent'
              }`}
            >
              <Car
                className={`w-5 h-5 transition-transform ${
                  isBuyActive ? 'stroke-[2.5px] scale-105 text-[#0e7c3a]' : 'stroke-2 text-slate-500'
                }`}
              />
            </div>
          </div>
          <span
            className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap ${
              isBuyActive ? 'font-black text-[#0e7c3a]' : 'font-semibold text-slate-500'
            }`}
          >
            Buy
          </span>
        </button>

        {/* Tab 3: Rent */}
        <button
          type="button"
          onClick={() => handleTabClick('rent-car')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            isRentActive
              ? 'text-[#0e7c3a]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Rent a Car"
        >
          <div className="relative">
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isRentActive ? 'bg-emerald-100/70' : 'bg-transparent'
              }`}
            >
              <Calendar
                className={`w-5 h-5 transition-transform ${
                  isRentActive ? 'stroke-[2.5px] scale-105 text-[#0e7c3a]' : 'stroke-2 text-slate-500'
                }`}
              />
            </div>
          </div>
          <span
            className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap ${
              isRentActive ? 'font-black text-[#0e7c3a]' : 'font-semibold text-slate-500'
            }`}
          >
            Rent
          </span>
        </button>

        {/* Tab 4: Import US */}
        <button
          type="button"
          onClick={() => handleTabClick('import-landing')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            isImportActive
              ? 'text-[#0e7c3a]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Import from USA"
        >
          <div className="relative">
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isImportActive ? 'bg-emerald-100/70' : 'bg-transparent'
              }`}
            >
              <Ship
                className={`w-5 h-5 transition-transform ${
                  isImportActive ? 'stroke-[2.5px] scale-105 text-[#0e7c3a]' : 'stroke-2 text-slate-500'
                }`}
              />
            </div>
          </div>
          <span
            className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap ${
              isImportActive ? 'font-black text-[#0e7c3a]' : 'font-semibold text-slate-500'
            }`}
          >
            Import
          </span>
        </button>

        {/* Tab 5: Menu / Full Directory */}
        <button
          type="button"
          onClick={() => {
            if (onOpenMenu) {
              onOpenMenu();
            }
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 text-slate-500 hover:text-slate-800"
          aria-label="Open Full Navigation Menu"
        >
          <div className="relative">
            <div className="w-9 h-7 rounded-full flex items-center justify-center transition-colors bg-transparent hover:bg-emerald-100/50">
              <Menu className="w-5 h-5 stroke-2 text-slate-600" />
            </div>
            {savedCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-[#12492f] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap font-bold text-slate-700">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
