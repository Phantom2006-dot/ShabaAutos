import React, { useState } from 'react';
import {
  Search,
  Tag,
  Truck,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  ShieldCheck,
  Fuel,
  Gauge,
  MapPin,
  Car as CarIcon,
  Calendar,
  Ship,
  DollarSign,
  Headphones,
} from 'lucide-react';
import { POPULAR_CARS } from '../data/cars';
import { Car, ScreenId } from '../types';
import { CustomSelect } from '../components/CustomSelect';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCar: (carId: string) => void;
  savedCarIds?: string[];
  onToggleSaveCar?: (carId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectCar,
  savedCarIds = [],
  onToggleSaveCar = (_carId: string) => {},
}) => {
  const [heroTab, setHeroTab] = useState<'buy' | 'rent' | 'import'>('buy');
  const [make, setMake] = useState('Select Make');
  const [model, setModel] = useState('Select Model');
  const [priceRange, setPriceRange] = useState('Any Price');
  const [location, setLocation] = useState('Select Location');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroTab === 'rent') {
      onNavigate('rent-car');
    } else if (heroTab === 'import') {
      onNavigate('import-landing');
    } else {
      onNavigate('buy-cars');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section matching web11.png */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef3f0] to-[#f4f7f5] pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 border-b border-slate-200/80">
        {/* Background Scenic Landscape */}
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=2000&q=80"
            alt="Scenic City Waterfront"
            className="w-full h-full object-cover object-center mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f5] via-[#f4f7f5]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Heading, Subtitle & 3 Feature Badges */}
            <div className="lg:col-span-6 space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.1]">
                Find, Rent or Import <br className="hidden sm:inline" />
                Your <span className="text-[#0e7c3a]">Perfect Car</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Quality cars. Trusted service. Total peace of mind.
              </p>

              {/* 3 Pills matching web11.png */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#0e7c3a]" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Verified Vehicles
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Inspected &amp; Certified
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Tag className="w-4 h-4 text-[#0e7c3a]" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Best Prices
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Market Competitive
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs">
                  <Truck className="w-4 h-4 text-[#0e7c3a]" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Nationwide Delivery
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Safe &amp; Reliable
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Car Photo (Black SUV overlooking City Skyline) matching web11.png */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative w-full max-w-[540px]">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85"
                  alt="Black Luxury SUV on Coastal Road"
                  className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Interactive Search Box matching web11.png */}
          <div className="mt-8 sm:mt-10 bg-white rounded-2xl shadow-lg border border-slate-200/80 p-5 sm:p-6">
            {/* Top Tabs: Buy Cars, Rent a Car, Import from US */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <button
                type="button"
                onClick={() => setHeroTab('buy')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroTab === 'buy'
                    ? 'bg-[#12492f] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CarIcon className="w-4 h-4" />
                Buy Cars
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroTab('rent');
                  onNavigate('rent-car');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroTab === 'rent'
                    ? 'bg-[#12492f] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Rent a Car
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroTab('import');
                  onNavigate('import-landing');
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  heroTab === 'import'
                    ? 'bg-[#12492f] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Ship className="w-4 h-4" />
                Import from US
              </button>
            </div>

            {/* Inputs Row */}
            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end"
            >
              <div>
                <CustomSelect
                  label="Make"
                  value={make}
                  onChange={setMake}
                  options={[
                    'Select Make',
                    'Toyota',
                    'Lexus',
                    'Mercedes-Benz',
                    'Honda',
                    'Range Rover',
                  ]}
                />
              </div>

              <div>
                <CustomSelect
                  label="Model"
                  value={model}
                  onChange={setModel}
                  options={[
                    'Select Model',
                    'Camry',
                    'RAV4',
                    'RX 350',
                    'GLE 450',
                    'Land Cruiser',
                    'Highlander',
                  ]}
                />
              </div>

              <div>
                <CustomSelect
                  label="Price Range"
                  value={priceRange}
                  onChange={setPriceRange}
                  options={[
                    'Any Price',
                    'Under ₦20,000,000',
                    '₦20m - ₦40,000,000',
                    '₦40m - ₦70,000,000',
                    'Above ₦70,000,000',
                  ]}
                />
              </div>

              <div>
                <CustomSelect
                  label="Location"
                  value={location}
                  onChange={setLocation}
                  options={[
                    'Select Location',
                    'Lagos',
                    'Abuja',
                    'Port Harcourt',
                    'Ibadan',
                  ]}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#12492f] hover:bg-[#0b3622] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  Search Cars
                </button>
              </div>
            </form>

            {/* Advanced Search Link */}
            <div className="mt-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('buy-cars')}
                className="text-xs font-semibold text-slate-600 hover:text-[#0e7c3a] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Advanced Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Pillars Bar matching web11.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                100% Verified
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                All vehicles are thoroughly inspected and verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 pt-4 sm:pt-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Transparent Pricing
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                No hidden fees. What you see is what you pay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-4 pt-4 lg:pt-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Doorstep Delivery
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                We deliver safely to your doorstep anywhere in Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 pt-4 sm:pt-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Expert Support
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Our team is here to help you at every step
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section matching web11.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Popular Cars
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('buy-cars')}
            className="text-xs sm:text-sm font-bold text-[#0e7c3a] hover:text-[#0b5c2a] flex items-center gap-1 group cursor-pointer"
          >
            View all cars
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 5 Cars Grid matching web11.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {POPULAR_CARS.slice(0, 5).map((car) => {
            const isSaved = Boolean(savedCarIds && savedCarIds.includes(car.id));
            return (
              <div
                key={car.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => {
                  onSelectCar(car.id);
                  onNavigate('car-details');
                }}
              >
                {/* Photo with Wishlist Heart */}
                <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveCar(car.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0e7c3a] line-clamp-1 transition-colors">
                      {car.make} {car.model} {car.year}
                    </h3>

                    <div className="text-base sm:text-lg font-black text-[#0e7c3a] mt-1">
                      ₦{car.priceNgn.toLocaleString()}
                    </div>

                    {/* Specs Row: 45,000 km • Automatic • Petrol */}
                    <div className="text-[11px] text-slate-500 mt-2 font-medium flex items-center gap-1.5 flex-wrap">
                      <span>{car.mileage.toLocaleString()} km</span>
                      <span>•</span>
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.fuelType}</span>
                    </div>
                  </div>

                  {/* Bottom: Location & Verified Badge */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {car.location}
                    </span>

                    {car.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0e7c3a] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Exploration Section */}
      <section className="bg-slate-900 text-white py-14 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => onNavigate('import-landing')}
              className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Ship className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Import from USA</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Access auction prices on Copart and IAAI with complete clearance to your door in Nigeria.
              </p>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                Explore Import Service <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onNavigate('rent-car')}
              className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Rent a Quality Car</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Clean, serviced sedans, SUVs, and luxury cars for daily, weekly, or corporate hire.
              </p>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                Browse Rental Fleet <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onNavigate('sell-car')}
              className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <Tag className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Sell Your Car Rapidly</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Get an instant valuation, free certified inspection, and get paid within 24 hours.
              </p>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                Value Your Vehicle <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
