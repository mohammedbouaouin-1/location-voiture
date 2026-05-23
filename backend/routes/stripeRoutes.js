const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/stripeController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');


const stripeIntentRules = () => [
  body('carId').notEmpty().withMessage("L'ID du véhicule est requis"),
  body('startDate').isISO8601().withMessage('Date de début invalide'),
  body('endDate').isISO8601().withMessage('Date de fin invalide'),
  body('fullName').notEmpty().withMessage('Le nom complet est requis'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),
];

router.post('/create-payment-intent', protect, stripeIntentRules(), validate, createPaymentIntent);



module.exports = router;
