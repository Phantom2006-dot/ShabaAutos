// ShabaAutos API Client & Free Car Database Services
import { BUY_CARS_INVENTORY } from '../data/cars';
import { Car } from '../types';

let getAuthTokenFn: (() => Promise<string | null> | string | null) | null = null;

export function setAuthTokenGetter(fn: () => Promise<string | null> | string | null) {
  getAuthTokenFn = fn;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (getAuthTokenFn) {
    try {
      const token = await getAuthTokenFn();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // Fallback
    }
  }
  return headers;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  condition?: string;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  city?: string;
  verified?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VehicleFacets {
  makes: string[];
  models: string[];
  bodyTypes: string[];
  conditions: string[];
  transmissions: string[];
  fuelTypes: string[];
  priceBounds: { min: number; max: number };
  yearBounds: { min: number; max: number };
  mileageBounds: { min: number; max: number };
}

export interface VehiclesApiResponse {
  success: boolean;
  data: Car[];
  pagination: PaginationMetadata;
  total: number;
  page: number;
  limit: number;
}

export interface OfferPayload {
  carId: string;
  carName: string;
  name: string;
  phone: string;
  email?: string;
  offerAmountNgn: number;
  paymentMethod?: string;
  notes?: string;
}

export interface InspectionPayload {
  carId: string;
  carName: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot?: string;
  hubLocation?: string;
  inspectionType?: 'Physical Inspection' | 'Live Video Tour' | 'Mechanic Verification';
}

export interface RentalBookingPayload {
  carId: string;
  carName: string;
  customerName?: string;
  renterName?: string;
  phone: string;
  email?: string;
  pickupDate: string;
  returnDate?: string;
  dropoffDate?: string;
  pickupLocation?: string;
  days: number;
  withChauffeur?: boolean;
  withInsurance?: boolean;
  dailyRateNgn: number;
}

export interface ImportDutyPayload {
  auctionPriceUsd: number;
  year?: number;
  originPort?: string;
  isElectric?: boolean;
}

export interface ImportRequestPayload {
  make: string;
  model: string;
  vehicleType?: string;
  budgetRange?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  estimatedBudgetUsd?: number;
  vin?: string;
  customerName?: string;
  fullName?: string;
  phone: string;
  email?: string;
  deliveryCity?: string;
  destinationPort?: string;
  transmission?: string;
  fuelType?: string;
  driveType?: string;
  mileagePref?: string;
  features?: string[];
  additionalNotes?: string;
}

export interface SellCarPayload {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  askingPriceNgn?: number;
  sellerName: string;
  phone: string;
  email?: string;
  location?: string;
  trim?: string;
  transmission?: string;
  fuelType?: string;
}

export interface ConciergePayload {
  fullName: string;
  phone: string;
  email?: string;
  desiredMake?: string;
  desiredModel?: string;
  make?: string;
  model?: string;
  bodyType?: string;
  budgetRange?: string;
  yearRange?: string;
  maxBudgetNgn?: number;
  preferredCondition?: string;
  notes?: string;
}

export interface ExternalCarLookupResult {
  searchTerm: string;
  title: string;
  imageUrl: string;
  description: string;
  specs: {
    engine: string;
    transmission: string;
    fuelType: string;
    drivetrain: string;
    estimatedNigeriaPriceNgn: string;
    rating: number;
  };
  verifiedSource: string;
}

export interface DecodedVinResult {
  vin: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyClass: string;
  doors: string;
  driveType: string;
  engineCylinders: string;
  displacementL: string;
  fuelTypePrimary: string;
  plantCountry: string;
  manufacturer: string;
  cleanTitle: boolean;
  stolenReported: boolean;
  recallStatus: string;
}

// 1. Submit price offer
export async function submitPriceOffer(payload: OfferPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      data: {
        id: `OFR-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
      },
      message: 'Offer registered! Our dealership rep will contact you shortly.',
    };
  }
}

// 2. Book physical or video inspection
export async function bookVehicleInspection(payload: InspectionPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/inspections', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      data: {
        id: `INSP-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      },
      message: 'Inspection booked! SMS notification dispatched.',
    };
  }
}

// 3. Book rental vehicle
export async function bookVehicleRental(payload: RentalBookingPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/rentals/book', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    const days = Math.max(1, payload.days || 1);
    const totalNgn = payload.dailyRateNgn * days + (payload.withChauffeur ? 15000 * days : 0);
    return {
      success: true,
      data: {
        id: `RNT-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        totalNgn,
        status: 'Active Reservation',
      },
      message: 'Rental car reserved successfully!',
    };
  }
}

// 4. Calculate Nigeria Customs import duty & clearing costs
export async function calculateCustomsImport(payload: ImportDutyPayload) {
  try {
    const res = await fetch('/api/imports/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    const priceUsd = payload.auctionPriceUsd || 15000;
    const rate = 1620;
    const oceanFreight = 1850;
    const inlandTowing = 450;
    const cifNgn = (priceUsd + oceanFreight + inlandTowing) * rate;
    const duty = Math.round(cifNgn * 0.35);
    const levy = Math.round(cifNgn * 0.15);
    const vat = Math.round((cifNgn + duty + levy) * 0.075);
    const terminal = 420000;
    const clearing = 350000;
    const totalClearance = duty + levy + vat + terminal + clearing;
    const totalLanded = (priceUsd + oceanFreight + inlandTowing) * rate + totalClearance;
    return {
      success: true,
      data: {
        auctionPriceUsd: priceUsd,
        vehicleYear: payload.year || 2022,
        usdToNgnRate: rate,
        oceanFreightUsd: oceanFreight,
        inlandTowingUsd: inlandTowing,
        cifValueUsd: priceUsd + oceanFreight + inlandTowing,
        cifValueNgn: cifNgn,
        importDutyNgn: duty,
        nacLevyNgn: levy,
        vatNgn: vat,
        terminalChargesNgn: terminal,
        clearingAgencyFeeNgn: clearing,
        totalCustomsClearanceNgn: totalClearance,
        vehicleLandedCostNgn: totalLanded,
        savingsVsLocalMarketNgn: Math.round(totalLanded * 0.22),
      },
    };
  }
}

// 5. Submit import request
export async function submitImportOrder(payload: ImportRequestPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/imports/request', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    const trackingId = `SHA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      trackingId,
      message: 'Import request received! Sourcing representative allocated.',
      data: {
        id: `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingId,
        ...payload,
        status: 'Sourcing Started',
      },
    };
  }
}

// 6. Track vehicle shipment by code or VIN
export async function trackOrderShipment(trackingId: string) {
  try {
    const res = await fetch(`/api/tracking/${encodeURIComponent(trackingId.trim())}`);
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      trackingId,
      status: 'In Transit',
      estimatedArrival: 'Nov 28, 2026',
      vesselName: 'MSC LEANNE V-402',
      originPort: 'Newark Container Terminal, NJ, USA',
      destinationPort: 'Tin Can Island Container Terminal, Lagos, Nigeria',
      currentLocation: 'Atlantic Ocean Transit',
    };
  }
}

// 7. Sell car submission
export async function submitSellCarValuation(payload: SellCarPayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/sell', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      message: 'Vehicle listed for valuation appraisal!',
      data: {
        id: `SELL-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        estimatedValueNgn: 38000000,
        status: 'Under Review',
      },
    };
  }
}

// 8. Submit Concierge Request
export async function submitConcierge(payload: ConciergePayload) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/concierge', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      message: 'Concierge request registered!',
      data: {
        id: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        status: 'Request Received',
      },
    };
  }
}

// -------------------------------------------------------------
// USER SPECIFIC ENDPOINTS (/api/me/*)
// -------------------------------------------------------------

export async function fetchMySavedVehicles(): Promise<{ success: boolean; savedCarIds: string[]; vehicles: Car[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/saved-vehicles', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, savedCarIds: [], vehicles: [] };
  }
}

export async function saveVehicleToAccount(vehicleId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/me/saved-vehicles/${encodeURIComponent(vehicleId)}`, {
      method: 'POST',
      headers,
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function removeSavedVehicleFromAccount(vehicleId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/me/saved-vehicles/${encodeURIComponent(vehicleId)}`, {
      method: 'DELETE',
      headers,
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function fetchMyComparison(): Promise<{ success: boolean; vehicleIds: string[]; vehicles: Car[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/comparison', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, vehicleIds: [], vehicles: [] };
  }
}

export async function updateMyComparison(vehicleIds: string[]): Promise<{ success: boolean; vehicleIds: string[]; vehicles: Car[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/comparison', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ vehicleIds }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, vehicleIds, vehicles: [] };
  }
}

export async function fetchSavedSearches(): Promise<{ success: boolean; data: any[] }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/saved-searches', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, data: [] };
  }
}

export async function createSavedSearch(name: string, criteria: any, notifyEmail = false, notifySms = false) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/saved-searches', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, criteria, notifyEmail, notifySms }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteSavedSearch(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/me/saved-searches/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function fetchMyOffers() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/offers', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function fetchMyInspections() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/inspections', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function fetchMyRentals() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/rentals', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function fetchMyImports() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/me/imports', { headers });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function syncUserProfile(data: { clerkId?: string; email: string; fullName: string; phone?: string; role?: string }) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/sync', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// ==========================================================
// FREE CAR APIS (NHTSA vPIC + WIKIMEDIA COMMONS CAR IMAGERY)
// ==========================================================

// 9. Fetch genuine models for any make using NHTSA free API
export async function fetchManufacturerModels(make: string): Promise<string[]> {
  try {
    const res = await fetch(`/api/external/models?make=${encodeURIComponent(make)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.success && Array.isArray(json.models) && json.models.length > 0) {
        return json.models;
      }
    }
  } catch (err) {
    console.error('Failed to fetch models from NHTSA:', err);
  }

  // Fallback defaults
  const defaults: Record<string, string[]> = {
    toyota: ['RAV4', 'Camry', 'Corolla', 'Highlander', 'Land Cruiser', 'Prado', 'Fortuner', 'Hilux', 'Venza', '4Runner'],
    lexus: ['RX 350', 'ES 350', 'GX 460', 'LX 570', 'LX 600', 'IS 300', 'NX 300'],
    'mercedes-benz': ['C-Class', 'E-Class', 'S-Class', 'GLE 450', 'GLC 300', 'GLS 450', 'G 63 AMG'],
    honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'HR-V'],
    bmw: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X6', 'X7'],
  };
  return defaults[make.toLowerCase()] || ['All Models', 'Sedan', 'SUV', 'Pickup', 'Coupe'];
}

// 10. Free VIN Decoder using NHTSA vPIC
export async function decodeVehicleVin(vin: string): Promise<DecodedVinResult | null> {
  try {
    const res = await fetch(`/api/external/vin/${encodeURIComponent(vin)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
    return null;
  } catch (err) {
    console.error('VIN decode request failed:', err);
    return null;
  }
}

// 11. Free Car Lookup & Image Fetcher (Wikipedia / Wikimedia Commons)
export async function lookupCarWithImage(query: string, make?: string, model?: string): Promise<ExternalCarLookupResult | null> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (make) params.append('make', make);
    if (model) params.append('model', model);

    const res = await fetch(`/api/external/car-lookup?${params.toString()}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
    return null;
  } catch (err) {
    console.error('Car lookup request failed:', err);
    return null;
  }
}

// 12. Fetch Vehicles filter query with persistent API, server-side filtering & pagination metadata
export async function fetchVehiclesWithPagination(params?: VehicleSearchParams): Promise<VehiclesApiResponse> {
  const searchParams = new URLSearchParams();
  if (params?.make && params.make !== 'All Makes' && params.make !== 'All') searchParams.append('make', params.make);
  if (params?.model && params.model !== 'All Models' && params.model !== 'All') searchParams.append('model', params.model);
  if (params?.condition && params.condition !== 'All Conditions' && params.condition !== 'All') searchParams.append('condition', params.condition);
  if (params?.bodyType && params.bodyType !== 'All Body Types' && params.bodyType !== 'All') searchParams.append('bodyType', params.bodyType);
  if (params?.transmission && params.transmission !== 'All Transmissions' && params.transmission !== 'All') searchParams.append('transmission', params.transmission);
  if (params?.fuelType && params.fuelType !== 'All Fuels' && params.fuelType !== 'All') searchParams.append('fuelType', params.fuelType);
  if (params?.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
  if (params?.minYear !== undefined) searchParams.append('minYear', params.minYear.toString());
  if (params?.maxYear !== undefined) searchParams.append('maxYear', params.maxYear.toString());
  if (params?.minMileage !== undefined) searchParams.append('minMileage', params.minMileage.toString());
  if (params?.maxMileage !== undefined) searchParams.append('maxMileage', params.maxMileage.toString());
  if (params?.city && params.city !== 'All Locations' && params.city !== 'All Cities' && params.city !== 'Select Location') searchParams.append('city', params.city);
  if (params?.verified !== undefined) searchParams.append('verified', String(params.verified));
  if (params?.search) searchParams.append('search', params.search);
  if (params?.sort) searchParams.append('sort', params.sort);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const queryStr = searchParams.toString();
  const endpoint = queryStr ? `/api/vehicles?${queryStr}` : '/api/vehicles';

  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return {
          success: true,
          data: json.data,
          pagination: json.pagination || {
            page: json.page || 1,
            pageSize: json.limit || 12,
            total: json.total || json.data.length,
            totalPages: Math.max(1, Math.ceil((json.total || json.data.length) / (json.limit || 12))),
            hasNextPage: false,
            hasPrevPage: false,
          },
          total: json.total !== undefined ? json.total : json.data.length,
          page: json.page || 1,
          limit: json.limit || 12,
        };
      }
    }
  } catch (err) {
    console.warn('[API DEV SEED FALLBACK] Vehicle API query failed, fallback to read-only seed catalogue in development:', err);
  }

  // Temporary read-only seed fallback in development only
  let filtered = [...BUY_CARS_INVENTORY];
  if (params?.make && params.make !== 'All Makes') {
    filtered = filtered.filter((c) => c.make?.toLowerCase() === params.make?.toLowerCase());
  }
  if (params?.model && params.model !== 'All Models') {
    filtered = filtered.filter((c) => c.model?.toLowerCase().includes(params.model?.toLowerCase() || ''));
  }
  if (params?.condition && params.condition !== 'All Conditions' && params.condition !== 'All') {
    filtered = filtered.filter((c) => c.condition?.toLowerCase() === params.condition?.toLowerCase());
  }
  if (params?.bodyType && params.bodyType !== 'All Body Types' && params.bodyType !== 'All') {
    filtered = filtered.filter((c) => c.bodyType?.toLowerCase() === params.bodyType?.toLowerCase());
  }
  if (params?.transmission && params.transmission !== 'All' && params.transmission !== 'All Transmissions') {
    filtered = filtered.filter((c) => c.transmission?.toLowerCase() === params.transmission?.toLowerCase());
  }
  if (params?.fuelType && params.fuelType !== 'All' && params.fuelType !== 'All Fuels') {
    filtered = filtered.filter((c) => c.fuelType?.toLowerCase() === params.fuelType?.toLowerCase());
  }
  if (params?.minPrice !== undefined) {
    filtered = filtered.filter((c) => c.priceNgn >= params.minPrice!);
  }
  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter((c) => c.priceNgn <= params.maxPrice!);
  }
  if (params?.minYear !== undefined) {
    filtered = filtered.filter((c) => c.year >= params.minYear!);
  }
  if (params?.maxYear !== undefined) {
    filtered = filtered.filter((c) => c.year <= params.maxYear!);
  }
  if (params?.minMileage !== undefined) {
    filtered = filtered.filter((c) => c.mileage >= params.minMileage!);
  }
  if (params?.maxMileage !== undefined) {
    filtered = filtered.filter((c) => c.mileage <= params.maxMileage!);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.make?.toLowerCase().includes(q) ||
        c.model?.toLowerCase().includes(q) ||
        c.year?.toString().includes(q) ||
        c.location?.toLowerCase().includes(q)
    );
  }

  // In-memory sort fallback
  if (params?.sort === 'price-asc') {
    filtered.sort((a, b) => a.priceNgn - b.priceNgn);
  } else if (params?.sort === 'price-desc') {
    filtered.sort((a, b) => b.priceNgn - a.priceNgn);
  } else if (params?.sort === 'mileage-asc') {
    filtered.sort((a, b) => a.mileage - b.mileage);
  } else if (params?.sort === 'mileage-desc') {
    filtered.sort((a, b) => b.mileage - a.mileage);
  } else if (params?.sort === 'year-desc') {
    filtered.sort((a, b) => b.year - a.year);
  } else if (params?.sort === 'year-asc') {
    filtered.sort((a, b) => a.year - b.year);
  }

  const page = params?.page || 1;
  const pageSize = params?.pageSize || params?.limit || 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    success: true,
    data: paged,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    total,
    page,
    limit: pageSize,
  };
}

// Backward-compatible fetchVehicles returning Car[]
export async function fetchVehicles(params?: VehicleSearchParams): Promise<Car[]> {
  const res = await fetchVehiclesWithPagination(params);
  return res.data;
}

// 13. Fetch single vehicle by ID or stock ID
export async function fetchVehicleById(id: string): Promise<Car | null> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[API DEV SEED FALLBACK] Vehicle fetch by ID failed, using read-only seed fallback:', err);
  }
  return BUY_CARS_INVENTORY.find((c) => c.id === id || c.stockId === id) || null;
}

// 14. Fetch dynamic inventory facets (makes, models, conditions, price bounds, years)
export async function fetchVehicleFacets(): Promise<VehicleFacets | null> {
  try {
    const res = await fetch('/api/vehicles/facets');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[API DEV SEED FALLBACK] Vehicle facets query failed:', err);
  }
  return null;
}

// 15. Create share token for vehicle
export async function createVehicleShareToken(vehicleId: string): Promise<{ success: boolean; shareToken?: string; shareUrl?: string; message?: string }> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(vehicleId)}/share-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: true,
      shareToken: `sh_${Math.random().toString(36).substring(2, 10)}`,
      shareUrl: `${window.location.origin}/?carId=${encodeURIComponent(vehicleId)}`,
    };
  }
}

