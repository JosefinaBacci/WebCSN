# WebCSN – School Management & Communication Platform

## Overview

WebCSN is a full-stack institutional management platform designed to handle user registration workflows, role-based access control, and segmented communication within an educational institution.

The system is built with a modular and scalable architecture, integrating authentication, administrative workflows, and multichannel notifications.

The project is currently deployed in production for demonstration purposes.

---

## Project Goals

* Manage user registrations with administrative approval workflows.
* Implement secure Role-Based Access Control (RBAC).
* Enable segmented institutional announcements.
* Integrate multichannel notifications (email and WhatsApp in progress).
* Provide a scalable foundation for future AI-based automation.

---

## 🏗️ Architecture

The platform follows a modular backend architecture with API Gateway pattern.

### High-Level Components

* **Frontend**: React application deployed on Vercel.
* **API Gateway**: Node.js backend deployed on Render.
* **Database**: MongoDB.
* **Containerization**: Docker-based services.
* **Email Service**: Resend (configured with custom domain).

To reduce infrastructure costs, only the API Gateway is deployed publicly. Internally, the architecture is designed to support microservices, but deployment is consolidated for economic efficiency.

---

## 📝 Deployment

* **Frontend**: Deployed on Vercel.
* **Backend (API Gateway)**: Deployed on Render.
* **Database**: MongoDB.
* **Custom Domain**: [https://colegionuevosolzapala.com](https://colegionuevosolzapala.com)
* **Email System**: Resend integrated with the institutional domain.

The system is accessible through a production domain and supports real email delivery.

---

## 🔐 Security

* JWT-based authentication.
* Role-Based Access Control (RBAC).
* Protected administrative routes.
* Backend-level authorization validation.

Roles include:

* Administrator
* Standard User (e.g., Parent)

---

## 🔄 Core Features

### User Management

* User registration system.
* Administrative approval/rejection workflow.
* Status transitions (Pending → Approved / Rejected).
* Ability to manually update user status.

### Announcement System

* Create institutional announcements.
* Segment announcements by grade.
* Automatic email distribution to selected recipients.

### Email Integration

* Transactional email system using Resend.
* Custom domain email configuration.
* Structured announcement delivery.

### Upcoming WhatsApp Integration

* Planned integration with WhatsApp Business API.
* Multichannel communication expansion.

### Planned AI Integration

* Institutional chatbot for FAQs.
* Automated responses based on official school information.
* Future implementation using retrieval-based approach (RAG).

---

## 🛠️ Tech Stack

### Frontend

* React
* Deployed on Vercel

### Backend

* Node.js
* Express (if applicable)
* API Gateway pattern
* JWT Authentication

### Database

* MongoDB

### DevOps

* Docker
* Render deployment
* Environment-based configuration

### External Services

* Resend (Email delivery)

---

## 📊 Data Model (Conceptual)

Main entities:

* User
* Role
* Registration Request
* Announcement
* Grade

Key relationships:

* A user has a role.
* Announcements target one or multiple grades.
* Registration requests have a status lifecycle.

---

## 🚀 Running the Project Locally

### 1️⃣ Clone the repository

```
git clone https://github.com/JosefinaBacci/WebCSN.git
cd WebCSN
```

### 2️⃣ Configure environment variables

Create a `.env` file with:

```
MONGODB_URI=
JWT_SECRET=
RESEND_API_KEY=
DOMAIN=
```

### 3️⃣ Run with Docker (recommended)

```
docker-compose up --build
```

Or run manually:

```
npm install
npm run dev
```

---

## 📌 Design Decisions

* Centralized API Gateway for cost-efficient deployment.
* Backend-enforced authorization (not frontend-only).
* Segmented notification logic to avoid unnecessary mass communication.
* Architecture prepared for horizontal scaling if microservices are deployed separately.
* Domain-based email authentication for production realism.

---

## 💼 Professional Focus

This project demonstrates:

* Backend system design.
* Authentication and authorization strategies.
* Workflow state management.
* Third-party API integration.
* Production deployment configuration.
* Cost-aware architectural decisions.

---

## 📈 Current Status

Active development.

Next improvements:

* WhatsApp Business integration.
* Automated testing suite.
* Logging and monitoring improvements.
* AI-powered institutional assistant.

---

## 👩‍💻 Author

Josefina Bacci
Full-Stack Developer (Student)
Developed as a portfolio-oriented professional project.
