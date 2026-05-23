const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { resolveImageUrl } = require('../utils/imageHelper');


const createBooking = async (req, res) => {
  try {
    const { car, fullName, phone, startDate, endDate, paymentMethod } = req.body;

    
    const carDetails = await Car.findById(car);
    if (!carDetails) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const diffTime = Math.abs(eDate - sDate);
    const calculatedTotalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const calculatedTotalPrice = calculatedTotalDays * carDetails.price;

    const overlapping = await Booking.findOne({
      car,
      status: { $ne: 'cancelled' },
      $and: [
        { startDate: { $lt: new Date(endDate) } },
        { endDate: { $gt: new Date(startDate) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Ce véhicule est déjà réservé pour cette période. Veuillez choisir d\'autres dates.' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      car,
      fullName,
      phone,
      startDate,
      endDate,
      totalDays: calculatedTotalDays,
      totalPrice: calculatedTotalPrice,
      paymentMethod,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('car', 'name image price')
      .populate('user', 'name email');

    populatedBooking.car.image = resolveImageUrl(populatedBooking.car.image);


    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'name image price')
      .sort({ createdAt: -1 })
      .lean();

    const bookingsWithImages = bookings.map(b => {
      if (b.car) {
        b.car.image = resolveImageUrl(b.car.image);
      }
      return b;
    });

    res.json(bookingsWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // Recherche sur le nom du conducteur ou le téléphone
    const query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const totalBookings = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('car', 'name image price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const bookingsWithImages = bookings.map(b => {
      if (b.car) {
        b.car.image = resolveImageUrl(b.car.image);
      }
      return b;
    });

    res.json({
      bookings: bookingsWithImages,
      page,
      totalPages: Math.ceil(totalBookings / limit),
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
       return res.status(403).json({ message: 'Non autorisé' });
    }

    if (!isAdmin) {
       if (req.body.status !== 'cancelled' || booking.status !== 'pending') {
          return res.status(400).json({ message: "Vous ne pouvez annuler qu'une réservation en attente" });
       }
    }

    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();

    const populated = await Booking.findById(updatedBooking._id)
      .populate('car', 'name image price')
      .populate('user', 'name email')
      .lean();
    
    if (populated && populated.car) {
      populated.car.image = resolveImageUrl(populated.car.image);
    }
    
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      await booking.deleteOne();
      
      res.json({ message: 'Réservation supprimée' });
    } else {
      res.status(404).json({ message: 'Réservation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking
};
