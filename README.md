# 🚗 LocaFès — Plateforme Premium de Location de Voitures

Bienvenue sur **LocaFès**, une application web moderne et élégante conçue pour simplifier la location de voitures à Fès et ses environs. Développée avec une architecture MERN (MongoDB, Express, React, Node.js), elle offre une expérience utilisateur ultra-fluide, rapide et sécurisée sur tous les appareils.

---

## ✨ Fonctionnalités Majeures

### 💻 Pour les Clients :
- **🚗 Exploration de la Flotte** : Parcourez un catalogue moderne avec des images haute définition et des fiches techniques détaillées.
- **🔍 Filtres Avancés** : Filtrez les véhicules par type de carburant, boîte de vitesse, nom ou dates de disponibilité.
- **📅 Réservations en Temps Réel** : Planifiez vos dates de location avec calcul automatique du prix total.
- **💳 Paiement Sécurisé** : Intégration complète avec **Stripe** pour des transactions sécurisées par carte bancaire.
- **📄 Facturation PDF** : Génération et téléchargement automatiques de factures PDF professionnelles après chaque réservation.
- **📱 Entièrement Responsive** : Une interface soignée et fluide, optimisée pour smartphones, tablettes et ordinateurs.

### 🛡️ Pour l'Administration :
- **📊 Tableau de Bord Intuitif** : Visualisez les revenus totaux, le taux d'occupation, et le nombre de réservations en un coup d'œil.
- **🔑 Gestion de la Flotte** : Ajoutez, modifiez ou désactivez des véhicules avec support de téléchargement d'images.
- **📅 Suivi des Réservations** : Gérez les statuts des réservations (en attente, confirmée, terminée, annulée).
- **👥 Gestion des Utilisateurs** : Contrôlez les accès et rôles (utilisateurs et administrateurs).

---

## 🛠️ Stack Technique

### Frontend :
- **React 19** & **React Router Dom**
- **Tailwind CSS** (Styling moderne et responsive)
- **Framer Motion** (Animations fluides et premiums)
- **React Hot Toast** (Notifications élégantes en temps réel)
- **Lucide Icons** (Iconographie épurée)
- **Axios** (Communication API fluide)

### Backend :
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Base de données NoSQL)
- **JSON Web Token (JWT)** & **BcryptJS** (Authentification et chiffrement sécurisés)
- **Helmet** & **Express Rate Limit** (Sécurité avancée contre les attaques)
- **Multer** & **Cloudinary** (Gestion optimisée des images)

---

## 🚀 Installation Locale

### 1. Prérequis :
- **Node.js** installé (v16+)
- Une base de données **MongoDB** (locale ou Atlas)

### 2. Cloner le projet :
```bash
git clone https://github.com/mohammedbouaouin-1/location-voiture.git
cd location-voiture
```

### 3. Configurer et lancer le Backend :
```bash
cd backend
# Créer un fichier .env et remplir les variables comme suit :
# PORT=5000
# MONGO_URI=votre_lien_mongodb
# JWT_SECRET=votre_secret_jwt
# STRIPE_SECRET_KEY=votre_cle_stripe

npm install
npm run seed  # Peupler la base avec 20 voitures par défaut
npm run dev   # Lancer le serveur de développement (port 5000)
```

### 4. Configurer et lancer le Frontend :
```bash
cd ..
# Configurer le fichier .env à la racine :
# REACT_APP_API_URL=http://localhost:5000

npm install
npm start     # Lancer le site (http://localhost:3000)
```

---

## ☁️ Déploiement en Production

La plateforme est entièrement configurée pour un déploiement cloud moderne :

- **Backend** : Déployé sur **[Railway](https://railway.app)** avec support de Reverse Proxy et base de données MongoDB Atlas.
- **Frontend** : Déployé sur **[Vercel](https://vercel.com)** avec routage Single Page Application et compatibilité complète des images mobiles.
