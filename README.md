# 💪 বাজার দর (Bazar Dor)

**Bazar Dor** is a Bengali-language web application that helps users explore daily market prices of essential commodities in Bangladesh. Users can browse products, compare price changes, explore categories, and view detailed market-wise price information through a responsive interface.

## 🌐 Live Website & Repository

- **Live Link:** https://b14-a7-bazar-dor-navy.vercel.app/
- **GitHub Repository:** https://github.com/joysoren-dev/B14-A7-Bazar-Dor

## 🛠️ Technologies Used

- **Next.js** — React framework and App Router for routing and page rendering
- **React** — Building interactive user interfaces
- **JavaScript** — Application logic
- **Tailwind CSS** — Styling and responsive layouts
- **Better Auth** — Authentication and account management
- **MongoDB** — Database integration
- **React Hot Toast** — Toast notifications
- **Vercel** — Deployment and hosting

## ✨ Key Features

1. **Responsive Design:** Layout adapts to mobile, tablet, and desktop screens.
2. **Market Price Overview:** Displays products with rising and falling prices.
3. **Product Catalog:** Shows product names, illustrations, units, prices in Bangladeshi Taka, and price-change indicators.
4. **Category Browsing:** Explore categories including rice, lentils, oil, vegetables, fish, meat, eggs and dairy, and spices.
5. **Product Details:** View product summaries, minimum, maximum, and average prices, and market-wise price information.
6. **Price Sorting:** Sort category products by default order, lowest price, or highest price.
7. **Authentication:** Sign in and sign up using Better Auth with email/password and configured social login providers.
8. **Loading States:** Show loading skeletons while product data is being fetched.
9. **User Feedback:** Display toast notifications for relevant authentication actions and errors.
10. **Dynamic Routing:** Navigate to category and product pages using dynamic routes.

## 🔌 API Endpoints

The application uses the Bazar Dor API to retrieve product and category information.

**Primary API Base URL**

```text
https://api.api-store.workers.dev/api/bazardor
```

**Alternative API Base URL**

```text
https://api.abcz.workers.dev/api/bazardor
```

| Endpoint | Description |
|---|---|
| `/products` | Retrieve all products |
| `/products?category=chal` | Filter products by category |
| `/products/1` | Retrieve a single product |
| `/categories` | Retrieve all categories |
| `/categories/chal` | Retrieve a single category |

## 📦 Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/joysoren-dev/B14-A7-Bazar-Dor.git
```

### 2. Navigate to the project directory

```bash
cd B14-A7-Bazar-Dor
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and configure the variables required by the application.

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Use the exact variable names expected by the application. Replace the example values with your own credentials and configure any additional variables required by your project.

**Security:** Never commit your `.env` file, database credentials, authentication secrets, or OAuth client secrets to GitHub.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

This project is deployed on Vercel.

**Live URL:** https://b14-a7-bazar-dor-navy.vercel.app/

To deploy your own version:

1. Import the GitHub repository into Vercel.
2. Add the required environment variables in the project settings.
3. Configure the production authentication URL and OAuth callback URLs.
4. Deploy the application.
5. Test the homepage, category pages, product details, authentication, and responsive layouts.

## 👨‍💻 Author

**Joy Soren**

- **GitHub:** [joysoren-dev](https://github.com/joysoren-dev)
- **Repository:** [B14-A7-Bazar-Dor](https://github.com/joysoren-dev/B14-A7-Bazar-Dor)

---

**Project:** Programming Hero — Assignment 7  
**Name:** Bazar Dor (বাজার দর)
