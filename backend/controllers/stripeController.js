const stripe = require('../config/stripe');
const Car = require('../models/Car');
const Booking = require('../models/Booking');



const createPaymentIntent = async (req, res) => {
  try {
    const { carId, startDate, endDate, fullName, phone, optionsPrice = 0 } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    const overlapping = await Booking.findOne({
      car: carId,
      status: { $ne: 'cancelled' },
      $and: [
        { startDate: { $lt: new Date(endDate) } },
        { endDate: { $gt: new Date(startDate) } }
      ]
    });
    if (overlapping) {
      return res.status(400).json({
        message: "Ce véhicule est déjà réservé pour cette période. Veuillez choisir d'autres dates."
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const finalTotalPrice = (totalDays * car.price) + Number(optionsPrice);

    
    const amountInCents = Math.round(finalTotalPrice * 9); 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        carId: car._id.toString(),
        carName: car.name,
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        fullName,
        phone,
        startDate,
        endDate,
        totalDays: totalDays.toString(),
        totalPrice: finalTotalPrice.toString(),
      }
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(' STRIPE_WEBHOOK_SECRET manquant dans .env');
    return res.status(500).send('Webhook secret non configuré');
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature invalide: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { metadata } = paymentIntent;

    try {
      
      const existingBooking = await Booking.findOne({
        user: metadata.userId,
        car: metadata.carId,
        startDate: new Date(metadata.startDate),  
      });

      if (!existingBooking) {
       
        console.log(` Réservation créée via Webhook pour ${metadata.fullName}`);

      } else {
        console.log(` Réservation déjà existante pour ${metadata.fullName} — webhook ignoré (idempotence)`);
      }
    } catch (error) {
      console.error(`Erreur création réservation via Webhook: ${error.message}`);
    }
  }

  
  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object;
    console.warn(`  Paiement échoué pour PaymentIntent ${pi.id} — ${pi.last_payment_error?.message || 'raison inconnue'}`);
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, handleStripeWebhook };
