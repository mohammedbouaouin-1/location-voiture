const { validationResult, body } = require('express-validator');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    message: 'Erreur de validation',
    errors: extractedErrors,
  });
};


const carValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('brand').notEmpty().withMessage('La marque est requise'),
    body('price').isNumeric().withMessage('Le prix doit être un nombre'),
    body('year').isNumeric().withMessage('L\'année doit être un nombre'),
    body('fuel').isIn(['Essence', 'Diesel', 'Électrique', 'Hybride']).withMessage('Type de carburant invalide'),
    body('gearbox').isIn(['Manuelle', 'Automatique']).withMessage('Type de boîte invalide'),
  ];
};

const bookingValidationRules = () => {
  return [
    body('car').notEmpty().withMessage('L\'ID du véhicule est requis'),
    body('startDate').isISO8601().withMessage('Date de début invalide'),
    body('endDate').isISO8601().withMessage('Date de fin invalide'),
    body('fullName').notEmpty().withMessage('Le nom complet est requis'),
    body('phone').notEmpty().withMessage('Le téléphone est requis'),
  ];
};

const registerValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Le nom est requis').trim(),
    body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères'),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').notEmpty().withMessage('L\'email est requis').isEmail().withMessage('Email invalide').normalizeEmail(),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ];
};

module.exports = {
  validate,
  carValidationRules,
  bookingValidationRules,
  registerValidationRules,
  loginValidationRules,
};
