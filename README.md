# ⚡ Cloud-Based Peer-to-Peer Energy Trading Platform

A modern cloud-powered web application that enables users to simulate **peer-to-peer energy trading** through a secure, scalable, and interactive dashboard. The platform allows users to monitor energy usage, track transactions, and participate in buying/selling energy units using a centralized cloud backend.

---

## 🚀 Overview

This project demonstrates the design and implementation of a **cloud-integrated energy trading system**, inspired by peer-to-peer (P2P) energy exchange models used in smart grids.

It combines:

* **Frontend (Next.js)** for an interactive user interface
* **AWS Cloud Services** for authentication and backend processing
* **Secure APIs** for data exchange
* **Real-time-like data handling** using efficient client-side state management

---

## ✨ Features

### 🔐 Authentication

* Secure user authentication using **AWS Cognito**
* Session management with JWT tokens

### 📊 Energy Dashboard

* View real-time energy metrics:

  * Energy Generated
  * Energy Consumed
  * Energy Stored

### 💸 Transaction Ledger

* Track all buy/sell transactions
* Includes:

  * Transaction type (Buy/Sell)
  * Units traded
  * Price
  * Status

### 🔄 Energy Trading Simulation

* Users can:

  * Purchase energy units
  * Sell excess energy
* Simulates a **peer-to-peer trading environment** via backend logic

### 🔔 Notifications System

* Alerts for successful transactions and updates

### ⚡ Efficient Data Fetching

* Implemented using **React Query**
* Optimized API calls with caching and state synchronization

---

## 🏗️ Architecture

```text
Frontend (Next.js)
        │
        │  (Authenticated API Calls)
        ▼
AWS Cognito  →  Authentication & JWT Tokens
        │
        ▼
AWS Lambda (Backend Logic)
        │
        ▼
Data Source (Ledger + Energy Data)
```

### Key Components:

* **Frontend:** Next.js (App Router), React, TypeScript
* **Authentication:** AWS Cognito
* **Backend:** AWS Lambda (via API URL)
* **State Management:** React Query
* **Styling:** Modern responsive UI components

---

## 🛠️ Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | Next.js, React, TypeScript |
| State Mgmt     | React Query                |
| Authentication | AWS Cognito                |
| Backend API    | AWS Lambda                 |
| Cloud Config   | AWS Amplify                |
| Styling        | CSS / Component-based UI   |

---

## 📁 Project Structure

```bash
src/
├── app/                # Next.js app router pages
├── components/         # UI components (Dashboard, Wallet, etc.)
├── context/            # Authentication context
├── hooks/              # Custom hooks (useLedger, useTelemetry)
├── lib/                # API and utility functions
├── config/             # Amplify and environment configs
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shirked/P2P-Cloud.git
cd P2P-Cloud
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_LAMBDA_URL=your_lambda_url
NEXT_PUBLIC_AWS_REGION=your_region
NEXT_PUBLIC_USER_POOL_ID=your_cognito_user_pool
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_client_id
```

---

### 4️⃣ Run the Application

```bash
npm run dev
```

App will run on:

```
http://localhost:3000
```

Deployed version:-

```
https://p2p-cloudnative-aws.vercel.app/
```

---

## 🧪 Mock Data Handling

The project includes fallback mock data for:

* Energy telemetry
* Transaction ledger

This ensures:

* Smooth UI demonstration
* Offline testing capability

---

## 📌 Future Enhancements

* 🔗 True peer-to-peer communication layer
* ⚡ Real-time updates using WebSockets / AWS AppSync
* 📦 Distributed energy storage simulation
* 🤖 Smart pricing based on supply-demand algorithms
* 🔐 Enhanced security with encryption mechanisms

---

## 🎯 Learning Outcomes

This project demonstrates:

* Cloud-based application architecture
* Secure authentication using AWS Cognito
* API integration with AWS Lambda
* Scalable frontend design using React & Next.js
* Real-world system modeling (energy trading)

---

## 👨‍💻 Author

**Deep Nitesh Shirke**
B.Tech IT | Cloud & AI/ML Enthusiast

---

## 📜 License

This project is for academic and learning purposes.
