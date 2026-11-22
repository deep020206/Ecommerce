# MERN Ecommerce

A full-stack ecommerce application built with React, Node.js, Express, MongoDB, Mongoose, and Chapa payments.

## Features

- Product catalogue by category
- MongoDB-backed items
- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Shopping cart
- Chapa payment initialization and verification
- Separate client and server environment configuration

## Project Structure

```text
client/   React application
server/   Express API and MongoDB integration
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- A Chapa secret key for live checkout

## Local Setup

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Copy the environment templates:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

On Linux or macOS, use `cp` instead of `copy`.

3. Configure `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
DNS_SERVERS=1.1.1.1,8.8.8.8
CLIENT_URL=http://localhost:3000
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CHAPA_URL=https://api.chapa.co/v1/transaction/initialize
CHAPA_VERIFY_URL=https://api.chapa.co/v1/transaction/verify
CHAPA_SECRET_KEY=<your-chapa-secret-key>
CHAPA_CURRENCY=ETB
```

Configure `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Never commit real `.env` files or secrets.

4. MongoDB Atlas setup:

- Create or select a database cluster.
- Create a database user.
- Add your current IP address to Network Access.
- Replace `<username>`, `<password>`, `<cluster-host>`, and `<database>` in `MONGO_URI`.
- URL-encode reserved characters in the MongoDB password.

5. Seed the product catalogue:

```bash
npm run seed
```

6. Start the application:

```bash
npm start
```

The React client runs at `http://localhost:3000` and the API runs at `http://localhost:5000`.

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/items` | List catalogue items |
| POST | `/api/items` | Add a catalogue item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/payment` | Initialize a Chapa checkout |
| GET | `/api/payment/verify/:id` | Verify a Chapa transaction |

## Available Scripts

Run at the project root:

```bash
npm start      # Run client and server
npm run client # Run only the React client
npm run server # Run only the API
npm run seed   # Seed MongoDB catalogue data
npm run build  # Create an optimized React build
```

## Security

- Keep `.env` files out of Git.
- Use environment-specific values for development and production.
- Rotate any credential that was committed or shared previously.
- Configure Chapa with HTTPS callback URLs in production.
