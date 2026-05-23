const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { resolveImageUrl } = require('../utils/imageHelper');


const getCars = async (req, res) => {
  try {
    const { fuel, gearbox, search, sort, startDate, endDate } = req.query;
    let query = { deletedAt: null };

    if (fuel && fuel !== 'all') query.fuel = fuel;
    if (gearbox && gearbox !== 'all') query.gearbox = gearbox;
    if (search) query.name = { $regex: search, $options: 'i' };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const overlappingBookings = await Booking.find({
        status: { $nin: ['cancelled', 'completed'] },
        $and: [
          { startDate: { $lte: end } },
          { endDate: { $gte: start } }
        ]
      });

      const bookedCarIds = overlappingBookings.map(b => b.car);
      query._id = { $nin: bookedCarIds };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'year') sortOption = { year: -1 };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const totalCars = await Car.countDocuments(query);
    const carsDocs = await Car.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const now = new Date();
    const activeBookings = await Booking.find({
      status: { $nin: ['cancelled', 'completed'] },
      endDate: { $gte: now }
    });
    const activeBookedCarIds = activeBookings.map(b => b.car.toString());

    const cars = carsDocs.map(car => ({
      ...car,
      image: resolveImageUrl(car.image),
      isAvailableNow: !activeBookedCarIds.includes(car._id.toString())
    }));

    res.json({
      cars,
      page,
      totalPages: Math.ceil(totalCars / limit),
      totalCars
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCarById = async (req, res) => {
  try {
    const carDoc = await Car.findOne({ _id: req.params.id, deletedAt: null }).lean();
    if (carDoc) {
      const now = new Date();

      const activeBooking = await Booking.findOne({
        car: carDoc._id,
        status: { $nin: ['cancelled', 'completed'] },
        endDate: { $gte: now } 
      });
      
      const car = {
        ...carDoc,
        image: resolveImageUrl(carDoc.image),
        isAvailableNow: !activeBooking
      };
      
      res.json(car);
    } else {
      res.status(404).json({ message: 'Voiture non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCar = async (req, res) => {
  try {
    const carData = { ...req.body };
    if (req.file) {
      carData.image = `/uploads/${req.file.filename}`;
    }
    const car = await Car.create(carData);
    
    const carResponse = car.toObject();
    carResponse.image = resolveImageUrl(carResponse.image);

    res.status(201).json(carResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateCar = async (req, res) => {
  try {
    const carData = { ...req.body };
    if (req.file) {
      carData.image = `/uploads/${req.file.filename}`;
    }
    const car = await Car.findByIdAndUpdate(req.params.id, carData, {
      new: true,
      runValidators: true,
    });
    if (car) {
      const carResponse = car.toObject();
      carResponse.image = resolveImageUrl(carResponse.image);
      res.json(carResponse);
    } else {
      res.status(404).json({ message: 'Voiture non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      car.deletedAt = new Date();
      await car.save();
      res.json({ message: 'Voiture supprimée (désactivée)' });
    } else {
      res.status(404).json({ message: 'Voiture non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCarReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const car = await Car.findById(req.params.id);

    if (car) {
      const alreadyReviewed = car.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce véhicule.' });
      }

      const review = {
        name: req.user.name || req.user.email.split('@')[0],
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      car.reviews.push(review);
      car.numReviews = car.reviews.length;
      car.rating =
        car.reviews.reduce((acc, item) => item.rating + acc, 0) /
        car.reviews.length;

      await car.save();
      res.status(201).json({ message: 'Avis ajouté avec succès' });
    } else {
      res.status(404).json({ message: 'Véhicule non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, createCarReview };
