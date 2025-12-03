# BAW Frontend

React frontend for the BAW (Buy and Sell Around the World) marketplace platform.

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── services/       # API services and utilities
├── store/          # Redux store configuration
├── styles/         # Global styles
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Features

### For Buyers
- Browse stores and products
- Search and filter products
- Add to cart and checkout
- Track orders
- Contact sellers

### For Sellers
- Create and manage store
- Upload and manage products
- View and manage orders
- Inventory tracking
- Payment integration

### Admin
- Manage orders
- Approve/reject sellers
- Track payments

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## API Integration

The frontend connects to the Django backend at `http://localhost:8000/api`

