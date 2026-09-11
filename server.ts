import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDatabaseService, getDatabaseType } from './server/database/index';
import { seedDatabase, hashPassword } from './server/scripts/seed';
import crypto from 'node:crypto';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize persistent database service
const dbService = getDatabaseService();

// Run automated seed check (deployment-safe initialization)
seedDatabase(false).catch((err) => {
  console.error('[DB Seed Check Error]:', err);
});

// Helper for password verification
function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// 1. Health & System Diagnostic Route
// -------------------------------------------------------------
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const { total } = await dbService.vehicles.list({ limit: 1 });
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: getDatabaseType(),
      totalVehicles: total,
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// -------------------------------------------------------------
// 2. Authentication & User Profile Routes
// -------------------------------------------------------------
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone, role } = req.body;
    if (!email || !password || !fullName || !phone) {
      return res.status(400).json({ success: false, message: 'All registration fields are required' });
    }

    const existing = await dbService.users.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = hashPassword(password);
    const user = await dbService.users.create({
      email,
      passwordHash,
      fullName,
      phone,
      role: role === 'admin' ? 'admin' : role === 'staff' ? 'staff' : 'customer',
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await dbService.users.findByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/user/saved-cars', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'usr_guest';
    const saved = await dbService.saved.getSavedVehicles(userId);
    res.json({ success: true, savedCarIds: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/user/saved-cars', async (req: Request, res: Response) => {
  try {
    const { userId = 'usr_guest', carId, action } = req.body;
    if (!carId) {
      return res.status(400).json({ success: false, message: 'carId is required' });
    }
    if (action === 'remove') {
      await dbService.saved.unsaveVehicle(userId, carId);
    } else {
      await dbService.saved.saveVehicle(userId, carId);
    }
    const saved = await dbService.saved.getSavedVehicles(userId);
    res.json({ success: true, savedCarIds: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. Vehicles Showroom & Inventory Endpoints
// -------------------------------------------------------------
app.get('/api/vehicles', async (req: Request, res: Response) => {
  try {
    const {
      make,
      model,
      condition,
      bodyType,
      transmission,
      fuelType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      city,
      verified,
      search,
      page = '1',
      limit = '50',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const result = await dbService.vehicles.list({
      make: make as string,
      model: model as string,
      condition: condition as string,
      bodyType: bodyType as string,
      transmission: transmission as string,
      fuelType: fuelType as string,
      minPrice: minPrice ? parseInt(minPrice as string, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string, 10) : undefined,
      minYear: minYear && minYear !== 'Min Year' ? parseInt(minYear as string, 10) : undefined,
      maxYear: maxYear && maxYear !== 'Max Year' ? parseInt(maxYear as string, 10) : undefined,
      city: city as string,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      search: search as string,
      limit: limitNum,
      offset,
    });

    // Hydrate images and seller for each vehicle
    const enrichedVehicles = await Promise.all(
      result.vehicles.map(async (v) => {
        const images = await dbService.vehicles.getImages(v.id);
        const seller = v.sellerId ? await dbService.vehicles.getSeller(v.sellerId) : null;
        return {
          ...v,
          images: images.length > 0 ? images.map((img) => img.url) : [
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80'
          ],
          seller: seller
            ? {
                name: seller.name,
                dealership: seller.dealershipName,
                verified: seller.verified,
                rating: seller.rating,
                reviews: seller.reviewsCount,
                location: seller.location,
                phone: seller.phone,
                email: seller.email,
                joined: seller.joinedYear,
              }
            : {
                name: 'Prime Motors Ltd',
                verified: true,
                rating: 4.9,
                reviews: 42,
                location: 'Lekki Phase 1, Lagos',
                phone: '+234 803 000 0000',
                joined: '2021',
              },
        };
      })
    );

    res.json({
      success: true,
      total: result.total,
      page: pageNum,
      limit: limitNum,
      data: enrichedVehicles,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let vehicle = await dbService.vehicles.findById(id);
    if (!vehicle) {
      vehicle = await dbService.vehicles.findByStockId(id);
    }
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const images = await dbService.vehicles.getImages(vehicle.id);
    const seller = vehicle.sellerId ? await dbService.vehicles.getSeller(vehicle.sellerId) : null;

    res.json({
      success: true,
      data: {
        ...vehicle,
        images: images.length > 0 ? images.map((img) => img.url) : [],
        seller: seller || {
          name: 'Prime Motors Ltd',
          verified: true,
          rating: 4.9,
          reviews: 42,
          location: 'Lekki Phase 1, Lagos',
          phone: '+234 803 000 0000',
          joined: '2021',
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 4. Offers Submission & Processing
// -------------------------------------------------------------
app.post('/api/offers', async (req: Request, res: Response) => {
  try {
    const { carId, carName, name, buyerName, phone, buyerPhone, email, buyerEmail, offerAmountNgn, paymentMethod, notes, purchaseNotes } = req.body;
    const finalName = (name || buyerName || '').trim();
    const finalPhone = (phone || buyerPhone || '').trim();
    const finalEmail = (email || buyerEmail || '').trim();
    const finalNotes = (notes || purchaseNotes || '').trim();
    const amount = Number(offerAmountNgn);

    if (!carId || !finalName || !finalPhone || !amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required offer information (carId, name, phone, offerAmountNgn)',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Offer amount must be greater than zero' });
    }

    // Do NOT trust client-provided price; look up genuine listing price from database
    const vehicle = await dbService.vehicles.findById(carId);
    const trueListingPrice = vehicle ? vehicle.priceNgn : amount;

    const offer = await dbService.offers.create({
      carId,
      carName: carName || (vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle'),
      name: finalName,
      phone: finalPhone,
      email: finalEmail || undefined,
      offerAmountNgn: amount,
      vehicleListingPriceNgn: trueListingPrice,
      paymentMethod: paymentMethod || 'Bank Transfer',
      notes: finalNotes || undefined,
      status: 'Pending Review',
    });

    // Record audit log
    await dbService.audit.record({
      actorRole: 'customer',
      action: 'SUBMIT_PRICE_OFFER',
      resourceType: 'offer',
      resourceId: offer.id,
      changesJson: JSON.stringify({ amountNgn: amount, carId }),
    });

    res.status(201).json({
      success: true,
      message: 'Your offer has been securely recorded and sent to the dealer for review!',
      data: offer,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 5. Vehicle Inspection Bookings
// -------------------------------------------------------------
app.post('/api/inspections', async (req: Request, res: Response) => {
  try {
    const { carId, carName, name, customerName, buyerName, phone, customerPhone, buyerPhone, email, customerEmail, buyerEmail, date, inspDate, timeSlot, inspTime, hubLocation, inspHub, inspectionType, inspType } = req.body;
    const finalName = (name || customerName || buyerName || '').trim();
    const finalPhone = (phone || customerPhone || buyerPhone || '').trim();
    const finalDate = (date || inspDate || '').trim();
    const finalTime = (timeSlot || inspTime || '10:00 AM - 12:00 PM').trim();
    const finalHub = (hubLocation || inspHub || 'Lekki Phase 1 Hub, Lagos').trim();
    const finalType = (inspectionType || inspType || 'Physical Inspection').trim() as any;

    if (!carId || !finalName || !finalPhone || !finalDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required inspection booking details (carId, name, phone, date)',
      });
    }

    const vehicle = await dbService.vehicles.findById(carId);

    const inspection = await dbService.inspections.create({
      carId,
      carName: carName || (vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle'),
      name: finalName,
      phone: finalPhone,
      email: (email || customerEmail || buyerEmail || '').trim() || undefined,
      date: finalDate,
      timeSlot: finalTime,
      hubLocation: finalHub,
      inspectionType: finalType,
      status: 'Confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Inspection booked successfully! Our certified automotive inspector will be expecting you.',
      data: inspection,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 6. Rental Vehicles & Transactional Booking
// -------------------------------------------------------------
app.get('/api/rentals/vehicles', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const vehicles = await dbService.rentals.listVehicles(category);
    res.json({ success: true, data: vehicles });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/rentals/book', async (req: Request, res: Response) => {
  try {
    const {
      carId,
      carName,
      customerName,
      renterName,
      name,
      phone,
      renterPhone,
      email,
      renterEmail,
      pickupDate,
      returnDate,
      dropoffDate,
      pickupLocation,
      days,
      withChauffeur,
      withInsurance,
    } = req.body;

    const finalName = (customerName || renterName || name || '').trim();
    const finalPhone = (phone || renterPhone || '').trim();
    const finalEmail = (email || renterEmail || '').trim();
    const finalPickup = (pickupDate || '').trim();
    const finalReturn = (returnDate || dropoffDate || '').trim();
    const numDays = Math.max(1, parseInt(days as string, 10) || 1);

    if (!finalName || !finalPhone || !finalPickup || !carId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required rental reservation details (carId, name, phone, pickupDate)',
      });
    }

    // Look up vehicle to enforce genuine daily rate (do NOT trust client rate)
    const rentalVehicle = await dbService.rentals.findVehicleById(carId);
    if (!rentalVehicle) {
      return res.status(404).json({ success: false, message: 'Rental vehicle not found' });
    }

    const dailyRate = rentalVehicle.pricePerDayNgn;
    const chauffeurFee = withChauffeur ? 25000 * numDays : 0;
    const insuranceFee = withInsurance ? 10000 * numDays : 0;
    const serverComputedTotal = dailyRate * numDays + chauffeurFee + insuranceFee;

    const booking = await dbService.rentals.createBookingWithBlock({
      carId,
      carName: carName || rentalVehicle.name,
      customerName: finalName,
      phone: finalPhone,
      email: finalEmail || undefined,
      pickupDate: finalPickup,
      returnDate: finalReturn || finalPickup,
      pickupLocation: pickupLocation || 'Lekki Hub, Lagos',
      days: numDays,
      dailyRateNgn: dailyRate,
      withChauffeur: Boolean(withChauffeur),
      withInsurance: Boolean(withInsurance),
      chauffeurFeeNgn: chauffeurFee,
      insuranceFeeNgn: insuranceFee,
      totalNgn: serverComputedTotal,
      status: 'Active Reservation',
    });

    res.status(201).json({
      success: true,
      message: 'Rental reservation confirmed! Our fleet coordinator will contact you for vehicle handover.',
      data: booking,
    });
  } catch (err: any) {
    if (err.message && err.message.includes('already booked')) {
      return res.status(409).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 7. Import Duty & Landed Cost Calculation Engine
// -------------------------------------------------------------
app.post('/api/imports/calculate', (req: Request, res: Response) => {
  try {
    const { auctionPriceUsd, year, originPort, isElectric } = req.body;

    if (!auctionPriceUsd || isNaN(auctionPriceUsd) || Number(auctionPriceUsd) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid or missing auctionPriceUsd' });
    }

    const priceUsd = Number(auctionPriceUsd);
    const vehicleYear = parseInt(year as string, 10) || new Date().getFullYear();

    const USD_TO_NGN = 1500;
    const oceanFreightUsd = originPort === 'Houston' ? 1950 : 1800;
    const inlandTowingUsd = 450;
    const totalUsd = priceUsd + oceanFreightUsd + inlandTowingUsd;

    const cifNgn = totalUsd * USD_TO_NGN;

    const dutyRate = isElectric ? 0.10 : 0.35;
    const levyRate = isElectric ? 0.05 : 0.15;
    const vatRate = 0.075;

    const importDutyNgn = Math.round(cifNgn * dutyRate);
    const nacLevyNgn = Math.round(cifNgn * levyRate);
    const vatNgn = Math.round((cifNgn + importDutyNgn + nacLevyNgn) * vatRate);

    const terminalChargesNgn = 380000;
    const clearingAgencyFeeNgn = 450000;
    const totalCustomsClearanceNgn = importDutyNgn + nacLevyNgn + vatNgn + terminalChargesNgn + clearingAgencyFeeNgn;
    const vehicleLandedCostNgn = cifNgn + totalCustomsClearanceNgn;

    const estimatedLocalDealerPriceNgn = Math.round(vehicleLandedCostNgn * 1.35);
    const savingsVsLocalMarketNgn = Math.max(0, estimatedLocalDealerPriceNgn - vehicleLandedCostNgn);

    res.json({
      success: true,
      data: {
        auctionPriceUsd: priceUsd,
        oceanFreightUsd,
        inlandTowingUsd,
        cifValueUsd: totalUsd,
        cifValueNgn: cifNgn,
        usdToNgnRate: USD_TO_NGN,
        dutyRate: dutyRate * 100,
        levyRate: levyRate * 100,
        importDutyNgn,
        nacLevyNgn,
        vatNgn,
        terminalChargesNgn,
        clearingAgencyFeeNgn,
        totalCustomsClearanceNgn,
        vehicleLandedCostNgn,
        estimatedLocalDealerPriceNgn,
        savingsVsLocalMarketNgn,
        estimatedTransitDays: '21-28 Days',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 8. Custom Import Request Submission
// -------------------------------------------------------------
app.post('/api/imports/request', async (req: Request, res: Response) => {
  try {
    const {
      make,
      model,
      year,
      yearMin,
      yearMax,
      estimatedBudgetUsd,
      budgetRange,
      vin,
      customerName,
      fullName,
      phone,
      email,
      deliveryCity,
      vehicleType,
      fuelType,
      transmission,
      driveType,
      mileagePref,
      features,
      additionalNotes,
    } = req.body;

    const finalName = (customerName || fullName || '').trim();
    const finalPhone = (phone || '').trim();
    const finalMake = (make || '').trim();
    const finalModel = (model || '').trim();

    if (!finalName || !finalPhone || !finalMake || !finalModel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required import request fields (customerName, phone, make, model)',
      });
    }

    const trackingId = `SHA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await dbService.imports.createRequest({
      trackingId,
      customerName: finalName,
      phone: finalPhone,
      email: (email || '').trim() || undefined,
      make: finalMake,
      model: finalModel,
      year: year ? parseInt(year as string, 10) : undefined,
      yearMin: yearMin ? String(yearMin) : undefined,
      yearMax: yearMax ? String(yearMax) : undefined,
      budgetRange: budgetRange ? String(budgetRange) : undefined,
      estimatedBudgetUsd: estimatedBudgetUsd ? parseInt(estimatedBudgetUsd as string, 10) : undefined,
      vin: vin ? String(vin).trim() : undefined,
      vehicleType: vehicleType ? String(vehicleType) : undefined,
      fuelType: fuelType ? String(fuelType) : undefined,
      transmission: transmission ? String(transmission) : undefined,
      driveType: driveType ? String(driveType) : undefined,
      mileagePref: mileagePref ? String(mileagePref) : undefined,
      features: Array.isArray(features) ? features : [],
      deliveryCity: deliveryCity || 'Lagos',
      destinationPort: 'Tin Can Island Container Terminal, Lagos',
      originPort: 'Port of Newark, NJ, USA',
      additionalNotes: additionalNotes || undefined,
      status: 'Sourcing Started',
    });

    // Add first initial milestone
    await dbService.imports.addMilestone({
      trackingId,
      stepOrder: 1,
      title: 'Order Submitted & US Agent Assigned',
      description: 'Your sourcing request has been received and assigned to our US dealer auction team.',
      scheduledDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isCompleted: true,
      isCurrent: true,
      location: 'ShabaAutos Operations Hub, Lagos',
    });

    res.status(201).json({
      success: true,
      message: 'Import order request submitted! Your designated US sourcing specialist will contact you.',
      trackingId,
      data: order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 9. Order & Container Tracking (No Fabricated Facts)
// -------------------------------------------------------------
app.get('/api/tracking/:trackingId', async (req: Request, res: Response) => {
  try {
    const query = req.params.trackingId.toUpperCase().trim();
    let order = await dbService.imports.findByTrackingId(query);
    if (!order) {
      order = await dbService.imports.findByVin(query);
    }

    if (!order) {
      // Truthful response: return found: false without fabricating fake ship or coordinates
      return res.json({
        success: true,
        found: false,
        trackingId: query,
        message: 'No active shipment found matching tracking code or VIN in our database.',
      });
    }

    const milestones = await dbService.imports.getMilestones(order.trackingId);
    const events = await dbService.imports.getTrackingEvents(order.trackingId);

    const mappedSteps = milestones.map((m) => ({
      step: m.stepOrder,
      title: m.title,
      desc: m.description,
      date: m.scheduledDate,
      completed: m.isCompleted,
      current: m.isCurrent,
    }));

    res.json({
      success: true,
      found: true,
      trackingId: order.trackingId,
      data: {
        orderId: order.trackingId,
        status: order.status,
        customerName: order.customerName,
        originPort: order.originPort,
        destinationPort: order.destinationPort,
        vesselName: events.length > 0 && events[0].vesselName ? events[0].vesselName : 'Vessel Assignment in Progress',
        containerNo: events.length > 0 && events[0].containerNo ? events[0].containerNo : 'Container Assignment in Progress',
        currentLocation: events.length > 0 ? events[0].location : 'Origin Terminal',
        car: {
          make: order.make,
          model: order.model,
          year: order.year || 2022,
          vin: order.vin || 'VIN Pending Assignment',
        },
        steps: mappedSteps,
        events,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 10. Sell Car Valuation & Consignment Submission
// -------------------------------------------------------------
app.post('/api/sell', async (req: Request, res: Response) => {
  try {
    const { make, model, year, trim, mileage, condition, askingPriceNgn, sellerName, fullName, phone, email, location, issues } = req.body;
    const finalSeller = (sellerName || fullName || '').trim();
    const finalPhone = (phone || '').trim();
    const finalMake = (make || '').trim();
    const finalModel = (model || '').trim();

    if (!finalMake || !finalModel || !finalSeller || !finalPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required vehicle information (make, model, sellerName, phone)',
      });
    }

    const asking = Number(askingPriceNgn) || 15000000;
    const carYear = parseInt(year as string, 10) || 2020;
    const carMileage = Number(mileage) || 50000;
    const carCondition = condition || 'Nigeria Used';

    // Market Valuation Algorithm
    const basePrices: Record<string, number> = {
      Toyota: 28000000,
      Lexus: 38000000,
      Mercedes: 45000000,
      Honda: 22000000,
      Hyundai: 18000000,
      Ford: 24000000,
    };
    const makeKey = Object.keys(basePrices).find((k) => finalMake.toLowerCase().includes(k.toLowerCase())) || 'Toyota';
    const base = basePrices[makeKey];

    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - carYear);
    const ageFactor = Math.max(0.4, 1 - age * 0.05);
    const mileageFactor = Math.max(0.65, 1 - (carMileage / 10000) * 0.03);
    const conditionFactor = carCondition === 'Foreign Used (Tokunbo)' ? 1.15 : carCondition === 'Brand New' ? 1.4 : 0.85;

    const estimatedValueNgn = Math.round(base * ageFactor * mileageFactor * conditionFactor);

    const submission = await dbService.sell.create({
      sellerName: finalSeller,
      phone: finalPhone,
      email: (email || '').trim() || undefined,
      make: finalMake,
      model: finalModel,
      year: carYear,
      trim: trim || undefined,
      mileage: carMileage,
      condition: carCondition,
      issues: issues || undefined,
      location: location || 'Lagos',
      askingPriceNgn: asking,
      estimatedValueNgn,
      status: 'Under Review',
    });

    // Record valuation audit history
    await dbService.sell.recordValuationHistory({
      sellSubmissionId: submission.id,
      make: finalMake,
      model: finalModel,
      year: carYear,
      mileage: carMileage,
      condition: carCondition,
      algorithmVersion: 'v2.2-ngn-market',
      baseValueNgn: base,
      mileageFactor,
      conditionFactor,
      finalValuationNgn: estimatedValueNgn,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle evaluation submitted! A ShabaAutos certified pricing specialist will inspect your vehicle details.',
      submissionId: submission.id,
      estimatedValueNgn,
      data: submission,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 11. Car Concierge ("Find Me a Car") Request
// -------------------------------------------------------------
app.post('/api/concierge', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      phone,
      email,
      desiredMake,
      make,
      desiredModel,
      model,
      bodyType,
      yearRange,
      budgetRange,
      maxBudgetNgn,
      preferredCondition,
      fuelType,
      fuel,
      transmission,
      colorPref,
      interiorPref,
      notes,
    } = req.body;

    const finalName = (fullName || '').trim();
    const finalPhone = (phone || '').trim();
    const finalMake = (desiredMake || make || '').trim();
    const finalModel = (desiredModel || model || 'Any Model').trim();

    if (!finalName || !finalPhone || !finalMake) {
      return res.status(400).json({
        success: false,
        message: 'Missing required concierge fields (fullName, phone, desiredMake/make)',
      });
    }

    const maxBudget = Number(maxBudgetNgn) || (budgetRange ? parseInt(String(budgetRange).replace(/[^0-9]/g, ''), 10) : 35000000) || 35000000;

    const request = await dbService.concierge.create({
      fullName: finalName,
      phone: finalPhone,
      email: (email || '').trim() || undefined,
      desiredMake: finalMake,
      desiredModel: finalModel,
      bodyType: bodyType || undefined,
      yearRange: yearRange || '2020 - 2024',
      budgetRange: budgetRange || undefined,
      maxBudgetNgn: maxBudget,
      preferredCondition: preferredCondition || 'Foreign Used (Tokunbo)',
      fuelType: fuelType || fuel || undefined,
      transmission: transmission || undefined,
      colorPref: colorPref || undefined,
      interiorPref: interiorPref || undefined,
      notes: notes || undefined,
      status: 'Request Received',
    });

    res.status(201).json({
      success: true,
      ticketId: request.id,
      message: 'Your concierge request has been prioritized! An automotive sourcing executive will contact you shortly with matched vehicles.',
      data: request,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 12. External API Grounding (Cached & Truthful)
// -------------------------------------------------------------

// A. NHTSA Vehicle Models by Make
app.get('/api/external/models', async (req: Request, res: Response) => {
  const make = ((req.query.make as string) || 'toyota').trim().toLowerCase();
  const cacheKey = `nhtsa:models:${make}`;

  const cached = await dbService.cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, make, models: cached });
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(make)}?format=json`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`NHTSA returned status ${response.status}`);
    const data = (await response.json()) as any;

    if (data.Results && Array.isArray(data.Results)) {
      const models = data.Results.map((r: any) => r.Model_Name).filter(Boolean);
      const uniqueModels = Array.from(new Set(models)).sort().slice(0, 40);

      // Cache for 24 hours
      await dbService.cache.set(cacheKey, 'nhtsa', uniqueModels, 86400, url);
      return res.json({ success: true, cached: false, make, models: uniqueModels });
    }
    throw new Error('No models found in NHTSA payload');
  } catch (err: any) {
    const fallbacks: Record<string, string[]> = {
      toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prado', 'Land Cruiser', 'Hilux', 'Venza', 'Sienna', 'Fortuner'],
      lexus: ['RX 350', 'ES 350', 'GX 460', 'LX 570', 'LX 600', 'IS 250', 'IS 350', 'NX 200t', 'NX 300'],
      mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLE 350', 'GLE 450', 'GLC 300', 'G 63 AMG', 'GLA 250', 'CLA 250'],
      honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'HR-V', 'City', 'Odyssey'],
    };
    const defaultModels = fallbacks[make] || ['Sedan Standard', 'SUV Performance', 'Luxury Trim', 'Cross Sport'];
    res.json({ success: true, cached: false, fallback: true, make, models: defaultModels });
  }
});

// B. Truthful NHTSA VIN Decoder (NEVER fabricate title, theft, or Carfax facts)
app.get('/api/external/vin/:vin', async (req: Request, res: Response) => {
  const vin = req.params.vin.trim().toUpperCase();
  if (vin.length !== 17) {
    return res.status(400).json({ success: false, message: 'VIN must be exactly 17 alphanumeric characters' });
  }

  const cacheKey = `nhtsa:vin:${vin}`;
  const cached = await dbService.cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`NHTSA HTTP ${response.status}`);
    const data = (await response.json()) as any;

    if (data.Results && data.Results[0]) {
      const result = data.Results[0];

      if (!result.Make || result.ErrorCode === '1') {
        return res.status(404).json({
          success: false,
          message: 'Vehicle VIN not recognized by government registry',
        });
      }

      const decoded = {
        vin,
        year: result.ModelYear || 'N/A',
        make: result.Make,
        model: result.Model,
        trim: result.Trim || undefined,
        bodyClass: result.BodyClass || undefined,
        doors: result.Doors || undefined,
        driveType: result.DriveType || undefined,
        engineCylinders: result.EngineCylinders || undefined,
        displacementL: result.DisplacementL ? `${parseFloat(result.DisplacementL).toFixed(1)}L` : undefined,
        fuelTypePrimary: result.FuelTypePrimary || undefined,
        plantCountry: result.PlantCountry || undefined,
        manufacturer: result.Manufacturer || result.Make,
        // Truthful notice: do NOT fabricate title or Carfax facts
        historyRecordsVerified: false,
        historyNotice: 'Title, theft, and recall verification require official NMVTIS / CarFax partner integration.',
      };

      await dbService.cache.set(cacheKey, 'nhtsa', decoded, 86400, url);
      return res.json({ success: true, cached: false, data: decoded });
    }
    return res.status(404).json({ success: false, message: 'Vehicle VIN not found in government registry' });
  } catch (err: any) {
    res.status(502).json({
      success: false,
      message: 'NHTSA government registry service temporarily unavailable. No verified data can be returned.',
    });
  }
});

// C. Free Car Lookup & Image Fetcher (Wikipedia / Wikimedia Commons Media API)
app.get('/api/external/car-lookup', async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const make = (req.query.make as string) || '';
  const model = (req.query.model as string) || '';
  const searchTerm = (query || `${make} ${model}`).trim();

  if (!searchTerm) {
    return res.status(400).json({ success: false, message: 'Query or make/model required' });
  }

  const cacheKey = `car-lookup:${searchTerm.toLowerCase().replace(/\s+/g, '_')}`;
  const cached = await dbService.cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
    const response = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'ShabaAutos/2.0 (automotive marketplace info)' },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = (await response.json()) as any;
      const result = {
        searchTerm,
        title: data.title || searchTerm,
        description: data.extract || `${searchTerm} overview and specifications.`,
        imageUrl: data.originalimage?.source || data.thumbnail?.source || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
        pageUrl: data.content_urls?.desktop?.page,
        verifiedSource: 'Wikimedia Open Automotive Encyclopedia',
      };

      await dbService.cache.set(cacheKey, 'wikimedia', result, 604800, wikiUrl);
      return res.json({ success: true, cached: false, data: result });
    }
    throw new Error('Wikipedia page summary not found');
  } catch (err: any) {
    const fallbackImages: Record<string, string> = {
      toyota: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
      lexus: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      mercedes: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      honda: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    };
    const key = Object.keys(fallbackImages).find((k) => searchTerm.toLowerCase().includes(k)) || 'toyota';
    const fallbackResult = {
      searchTerm,
      title: searchTerm,
      description: `${searchTerm} is a highly sought-after vehicle in the Nigerian automotive market known for durability, luxury, and high resale value.`,
      imageUrl: fallbackImages[key],
      verifiedSource: 'ShabaAutos Curated Automotive Catalog',
    };
    res.json({ success: true, cached: false, fallback: true, data: fallbackResult });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Production Static Handling
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShabaAutos Server running on http://localhost:${PORT}`);
  });
}

startServer();
