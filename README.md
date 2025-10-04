# 🏪 E-commerce Platform

Backend API and mobile app built during CGS-team internship.

![NestJS](https://img.shields.io/badge/Backend-NestJS-blue)
![React Native](https://img.shields.io/badge/Mobile-React%20Native-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 🚀 Features

- **Authentication** - JWT-based auth with email verification
- **Product Catalog** - Search, filter, and browse products
- **Shopping Cart** - Add/remove items, quantity management
- **Order Management** - Complete order processing workflow
- **Mobile App** - Cross-platform iOS/Android app

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | NestJS, PostgreSQL, Prisma ORM |
| **Mobile** | React Native, Expo |
| **Auth** | JWT, Passport.js |
| **Email** | SendGrid |

## 🚀 Quick Start

1. **Clone and install**
```bash
git clone https://github.com/Etherwoood/cgs-internship.git
cd cgs-internship
npm install
```

2. **Setup environment**
```bash
cp packages/backend/config.example.env packages/backend/.env
cp packages/mobile/config.example.env packages/mobile/.env
```

3. **Start PostgreSQL with Docker**
```bash
cd packages/backend
docker-compose up -d
```

4. **Start development**
```bash
# Backend
cd packages/backend && npm run start:dev

# Mobile
cd packages/mobile && npm start
```



---
**Built during CGS-team internship** | **Author:** [Etherwoood](https://github.com/Etherwoood)
