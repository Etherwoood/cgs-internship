# Environment Configuration Setup

## Backend Configuration

1. Copy the example environment file:
```bash
cd packages/backend
cp config.example.env .env
```

2. Edit `.env` file with your actual values:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourcompany.com"

# Server
PORT=3030
NODE_ENV="development"
```

## Mobile Configuration

1. Copy the example environment file:
```bash
cd packages/mobile
cp config.example.env .env
```

2. Edit `.env` file with your actual API URL:
```env
# API Configuration
EXPO_PUBLIC_API_URL="http://your-backend-ip:3030"

# Development
NODE_ENV="development"
```

## Important Notes

- **Never commit `.env` files to version control**
- Use your actual IP address instead of `localhost` for mobile development
- Generate a strong JWT secret for production
- Configure proper SendGrid API key for email functionality
- Update `DATABASE_URL` with your actual PostgreSQL connection string

## Security

- All hardcoded URLs and sensitive information have been removed from the codebase
- Environment variables are properly configured with fallbacks
- Production secrets should be managed through secure environment variable systems
