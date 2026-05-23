const User = require('../models/User');
const generateToken = require('../utils/generateToken');


const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    
    const user = await User.create({ name, email, password, phone });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Données invalides' });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    
    if (user.deletedAt) {
      return res.status(403).json({ message: 'Ce compte a été désactivé. Contactez le support.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};




const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
