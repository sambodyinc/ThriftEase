# ThriftEase — Sustainable Fashion Marketplace

This is a Next.js starter project for **ThriftEase**, a responsive e-commerce web app for a thrift fashion store.

## ✨ Features

- **Home Page**: Hero banner, "Just In" section, and featured categories.
- **Shop Page**: Product grid with filters for category, size, price, etc.
- **Product Details**: Image carousel, description, and "Add to Cart" functionality.
- **Guest & User Checkout**: Supports both guest and registered user checkout flows.
- **AI-Powered Recommendations**: Personalized product suggestions for users.
- **Admin Panel**: A secure area for managing products and viewing orders.
- **Responsive Design**: Mobile-first UI that looks great on all devices.

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

### Firestore Security Rules

For production, you need to secure your database. Here is a basic set of rules to get started. You should customize these to fit your exact needs.

Go to `Firestore Database > Rules` in your Firebase console and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products are publicly readable
    match /products/{productId} {
      allow read: if true;
      // Only admins can write to products
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own orders
    match /user_orders/{orderId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Admin can read all user orders
    match /user_orders/{orderId} {
        allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }

    // Guest orders are write-only
    match /guest_orders/{orderId} {
        allow create: if true;
        allow read, update, delete: if false; // Or allow admin access
    }
  }
}
```

## 部署

This app is configured for deployment on Firebase Hosting.
