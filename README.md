# Project description
**WebCSN** is a distributed, event-driven school communication platform built using a microservices architecture.

<p  align="justify"> The system is designed to demonstrate modern backend engineering practices, including asynchronous event processing, real-time communication, secure API design, and containerized service orchestration.
The platform enables administrators to create announcements that are processed through an event-driven pipeline powered by RabbitMQ. Each announcement triggers independent services responsible for persistence, notifications, and real-time updates via WebSockets — ensuring loose coupling, scalability, and fault isolation.
WebCSN implements an API Gateway pattern with centralized JWT-based authentication and Role-Based Access Control (RBAC), allowing secure and stateless service communication.</p>

This project highlights:
- Distributed systems design
- Event-driven architecture
- Publisher/Subscriber messaging patterns
- Microservices separation of concerns
- Real-time system integration
- Scalable, containerized infrastructure

WebCSN serves as a practical demonstration of how production-ready microservices can be designed for maintainability, extensibility, and independent scalability.
