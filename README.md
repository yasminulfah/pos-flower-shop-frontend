# POS Flower Shop (Frontend)

This is the frontend application for the **POS (Point of Sale) Flower Shop** system. It is built using **React** and **Vite**, offering a modern, responsive interface for both customers (E-commerce) and staff/admins (Management Dashboard).

## 🚀 Features

The application is divided into two main sections:

### 🛍️ Customer Portal (E-commerce)
-   **Product Catalog**: Browse available flowers and arrangements.
-   **Product Details**: View detailed information about products.
-   **Shopping Cart**: Add items, manage quantities, and view subtotal.
-   **Checkout**: Process orders securely.
-   **Order History**: Track past orders and view status.
-   **User Authentication**: Login and registration for customers.

### 💼 Admin & Staff Portal
-   **Dashboard**: Overview of sales, orders, and key metrics with charts.
-   **POS System**: Interface for processing in-store transactions.
-   **Product Management**: CRUD operations for products (Add, Edit, Delete).
-   **Order Management**: View and update order statuses.
-   **Receipt Printing**: Generate and print receipts for orders.
-   **Role-Based Access**: Protected routes for Admins and Staff.

## 🛠️ Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Routing**: [React Router DOM v7](https://reactrouter.com/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Charts**: [Chart.js](https://www.chartjs.org/) & [React Chartjs 2](https://react-chartjs-2.js.org/)
-   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher recommended)
-   [npm](https://www.npmjs.com/) (Node Package Manager)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pos-flower-shop-frontend.git
    cd pos-flower-shop-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory. You can copy the structure from `.env.example` if it exists, or add the following:

    ```env
    VITE_API_BASE_URL=http://127.0.0.1:8000
    ```
    > **Note**: Replace the URL with your actual backend API URL if different. The default is set to a local Laravel backend.

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173`.

## 📂 Project Structure

```
src/
├── api/             # Axios configuration and API services
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── context/         # React Context (Auth, Cart, etc.)
├── layouts/         # Page layouts (AdminLayout, CustomerLayout)
├── pages/           # Page components (routed views)
│   ├── admin/       # Admin-specific pages (Dashboard, POS, etc.)
│   └── ...          # Customer-facing pages
├── App.jsx          # Main application component with Routes
└── main.jsx         # Entry point
```

## 🔗 Backend

This frontend requires a **Laravel API** backend to function correctly. Ensure your backend server is running and accessible at the URL defined in your `.env` file.

The backend should provide endpoints for:
-   Authentication (Login, Register, Logout)
-   Products (CRUD)
-   Orders (Create, Read, Update)
-   Reports/Dashboard data

## 📄 License

[MIT](https://opensource.org/licenses/MIT)
