# ThriftEase — Sustainable Fashion Marketplace

This is a Next.js starter project for **ThriftEase**, a responsive e-commerce web app for a thrift fashion store. It's built with modern web technologies to provide a fast, scalable, and feature-rich foundation for your online second-hand clothing business.

## ✨ Features

- **Home Page**: Hero banner, "Just In" section, and featured categories.
- **Shop Page**: Product grid with filters for category, size, price, etc.
- **Product Details**: Image carousel, description, and "Add to Cart" functionality.
- **Shopping Cart**: A client-side cart to manage items before checkout.
- **Guest Checkout**: A streamlined checkout process for guest users.
- **Account Management**: Stub pages for user login, signup, and account details.
- **AI-Powered Recommendations**: Personalized product suggestions for users on the home page.
- **Admin Panel**: A secure, placeholder dashboard for managing products and viewing orders.
- **Responsive Design**: Mobile-first UI that looks great on all devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Context (`useCart`)
- **Deployment**: Configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/installation) (or npm/yarn)
- A [Firebase](https://firebase.google.com/) project

### Firebase Setup

1.  **Create a Firebase Project**:
    Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Enable Firebase Services**:
    In your new project, enable the following services:
    - **Authentication**: Go to the "Authentication" tab, click "Get started", and enable the **Email/Password** and **Google** sign-in providers.
    - **Firestore Database**: Go to the "Firestore Database" tab, click "Create database", and start in **test mode** for development. *For production, you must set up security rules.*
    - **Storage**: Go to the "Storage" tab and click "Get started".

3.  **Get Firebase Config**:
    - In your Firebase project settings (click the gear icon ⚙️), scroll down to "Your apps".
    - Click the web icon (`</>`) to create a new web app.
    - Give it a nickname (e.g., "ThriftEase Web") and register the app.
    - Firebase will provide you with a `firebaseConfig` object. You will need these values.

4.  **Set up Environment Variables**:
    - Create a file named `.env.local` in the root of your project.
    - Copy the values from your `firebaseConfig` object into this file:

    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

### Local Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    pnpm dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 📂 Project Structure

The project uses the Next.js App Router convention. Here is an overview of the key directories:

```
.
├── src
│   ├── app/                # Main application routes
│   │   ├── (pages)/        # Route groups for pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── Header.tsx      # Site header
│   │   ├── Footer.tsx      # Site footer
│   │   └── ProductCard.tsx # Component for displaying a single product
│   ├── hooks/              # Custom React hooks
│   │   └── use-cart.tsx    # Logic for shopping cart state
│   ├── lib/                # Helper functions, types, and constants
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── data.ts         # Sample product data
│   │   └── utils.ts        # Utility functions (e.g., currency formatting)
│   ├── ai/                 # Genkit AI flows and configuration
│   │   └── flows/          # AI logic for features like recommendations
├── public/                 # Static assets
└── tailwind.config.ts    # Tailwind CSS configuration
```

##🎨 Styling

- **Tailwind CSS**: Utility classes are used for most styling. The configuration is in `tailwind.config.ts`.
- **ShadCN UI**: The base components are from ShadCN, located in `src/components/ui`. They are fully customizable.
- **Theme & Colors**: The app's color palette is defined using CSS variables in `src/app/globals.css`. You can modify the HSL values under the `:root` selector to change the primary, secondary, accent, and background colors. Both light and dark modes are supported.
- **Fonts**: The project uses `Poppins` for headlines and body text. Fonts are configured in `src/app/layout.tsx`.

##🛒 State Management

The primary piece of client-side state is the shopping cart, which is managed via React Context.

- **`src/hooks/use-cart.tsx`**: This file contains the `CartProvider` and the `useCart` hook.
- **`CartProvider`**: Wraps the application in `src/components/Providers.tsx` to make cart state available globally.
- **`useCart()`**: This hook can be used in any client component to access and manipulate the cart's contents (e.g., `addToCart`, `removeFromCart`).
- **Persistence**: The cart's state is automatically saved to and retrieved from the browser's `localStorage` to persist between sessions.

##🤖 AI Features

The application leverages Google's Genkit to provide AI-powered functionality.

- **`src/ai/flows/personalized-recommendations.ts`**: This flow takes a user's (mock) purchase and browsing history and uses an LLM to suggest other products they might like.
- **Usage**: The flow is called on the home page (`src/app/page.tsx`) inside the `PersonalizedRecs` Server Component to display a "Just For You" section.

##🔐 Authentication & Admin

- **Auth Pages**: The `/login`, `/signup`, and `/account` pages are placeholders. They contain UI and form handling but are not connected to a live authentication backend. You would need to integrate Firebase Authentication methods in these files.
- **Admin Route**: The `/admin` route is protected by `src/middleware.ts`. Currently, it denies access by default. To access the page, you can temporarily change `return false;` to `return true;` in the `isAuthenticatedAsAdmin` function. In a real application, this should be replaced with logic that verifies an admin user's session cookie.

## Firestore Security Rules

For production, you need to secure your database. Here is a basic set of rules to get started. You should customize these to fit your exact needs.

Go to `Firestore Database > Rules` in your Firebase console and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin(); // Admins can read user profiles
    }
    
    match /orders/{orderId} {
      // Users can read their own orders.
      allow read, create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      // Admins can read and write all orders.
      allow read, write: if isAdmin();
    }
    
    // Admins can list all orders.
    match /orders {
        allow list: if isAdmin();
    }

    match /guest_orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

## 🌐 Deployment

This app is configured for deployment on Firebase Hosting. The `apphosting.yaml` file contains the basic configuration for the backend.
