# WebCSN – Production School Management & Communication Platform

## 📌 Overview

WebCSN is a production-deployed full-stack school management and communication platform currently used by a real educational institution.

The system manages user registration workflows, role-based access control, and segmented institutional communication, while being architected with scalability and modularity in mind.

This project was designed not as a demo, but as a real-world system operating under a custom domain with real users and transactional email delivery.

---

## 🎯 Core Objectives

* Manage user registrations with administrative approval workflows.
* Enforce secure Role-Based Access Control (RBAC).
* Enable targeted institutional announcements.
* Integrate production-ready transactional email.
* Support asynchronous communication between components.
* Maintain a microservice-ready architecture while optimizing infrastructure costs.

---

## 🏗️ Architecture

The backend follows an API Gateway pattern with modular, microservice-ready design principles.

### 🔹 High-Level Components

* **Frontend:** React application
* **Backend:** Node.js API Gateway
* **Database:** MongoDB (cloud-hosted)
* **Async Communication:** RabbitMQ (where applicable)
* **Containerization:** Docker
* **Email Service:** Resend (custom domain configured)

Although the current deployment consolidates services for cost efficiency, the internal structure supports separation into independent microservices.

---

## 🔐 Security & Access Control

* JWT-based authentication
* Role-Based Access Control (RBAC)
* Server-side authorization enforcement
* Protected administrative routes

All critical authorization checks are performed on the backend, not solely on the frontend.

---

## 🔄 Core Features

### 👤 User & Registration Management

* User self-registration
* Administrative approval/rejection workflow
* Registration status lifecycle (Pending → Approved / Rejected)
* Manual status updates when required

### 📢 Announcement System

* Creation of institutional announcements
* Segmentation by grade
* Targeted notification delivery to selected recipients

### 📩 Email Integration

* Transactional email delivery via Resend
* Custom domain configuration
* Authenticated email setup (SPF/DKIM/DMARC as required)

### 🔁 Asynchronous Processing

* RabbitMQ integration for asynchronous communication where applicable
* Decoupled notification handling

---

## 🛠️ Tech Stack

### Frontend

* React
* Deployed on Vercel

### Backend

* Node.js
* API Gateway pattern
* JWT Authentication

### Database

* MongoDB (cloud-hosted)

### Messaging

* RabbitMQ

### DevOps & Infrastructure

* Docker
* Render deployment
* Environment-based configuration

### External Services

* Resend (email delivery with institutional domain)

---

## 🚀 Deployment

### Frontend

* Deployed on Vercel
* Connected to the main (or deployment) branch
* Environment variables configured via Vercel dashboard

### Backend (API Gateway)

* Deployed on Render as a Node.js service
* Connects to MongoDB and Resend using environment variables

### Database

* MongoDB (cloud-hosted)

### Custom Domain

* Production domain: [https://colegionuevosolzapala.com](https://colegionuevosolzapala.com)
* Configured with appropriate DNS records
* Email authentication configured for Resend

---

## 📌 Design Decisions

### Centralized API Gateway

Simplifies public exposure and keeps infrastructure costs low while preserving a modular, microservice-friendly codebase.

### Backend-Enforced Authorization

All critical authorization checks are performed server-side, not only in the frontend.

### Segmented Communication

Announcements and notifications are targeted (e.g., by grade) to avoid unnecessary mass messaging.

### Scalability in Mind

Each service can be separated and scaled independently in the future by changing the deployment topology.

### Production-Realistic Email Setup

Resend is integrated with a custom domain to resemble a real institutional environment.

---

## 💼 Professional Scope

This project demonstrates:

* Backend system design and microservice-ready architecture
* Authentication and authorization strategies (JWT + RBAC)
* Workflow and state management (registration approval, user statuses)
* Asynchronous messaging with RabbitMQ
* Third-party API integration (Resend)
* Production deployment under a custom domain
* Cost-aware architectural decision making

---

## 👩‍💻 Author

Josefina Bacci
Full-Stack Developer (Student)

Developed as a professional, production-oriented portfolio project currently used by a real educational institution.
