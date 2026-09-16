# Smart Helpdesk Queue API

A smart helpdesk ticket management system built with **Java 21, Spring Boot, Spring Data JPA, H2 Database, HTML, CSS, and JavaScript**.

The system automatically organizes support tickets based on priority and response deadlines so that the helpdesk can focus on the most pressing tickets first.

---

## 🚀 Features

- Smart ticket queue
- Priority-based ticket ordering
- Automatic overdue detection
- Automatic priority escalation
- Customer name search
- Assignee filtering
- Priority filtering
- Overdue filtering
- Pagination
- Create new tickets
- Responsive web dashboard
- REST API
- H2 in-memory database
- Scheduled background escalation

---

## 🧠 Smart Queue Logic

Tickets are ordered according to the following rules:

1. **Overdue tickets come first**
2. Within the same overdue state:
   - URGENT
   - HIGH
   - NORMAL
3. Earlier response deadline comes first
4. Older tickets are used as the final tie-breaker

### Queue Priority

```text
OVERDUE
   ↓
URGENT
   ↓
HIGH
   ↓
NORMAL
   ↓
EARLIEST DEADLINE
   ↓
OLDEST CREATED TICKET
```

Resolved and closed tickets are excluded from the active helpdesk queue.

---

## ⏱️ Automatic Priority Escalation

The system automatically checks for tickets whose response deadline has been breached.

Priority is increased **one level per scheduled run**:

```text
NORMAL → HIGH → URGENT
HIGH → URGENT
URGENT → URGENT
```

Resolved and closed tickets are not escalated.

The escalation process runs automatically every **60 seconds**.

### Example

Suppose a ticket has:

```text
Priority: NORMAL
Deadline: 10:00 AM
Current Time: 10:30 AM
```

After the escalation check:

```text
NORMAL → HIGH
```

If the ticket remains overdue until the next escalation run:

```text
HIGH → URGENT
```

Once the ticket reaches URGENT, it remains URGENT.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend development |
| Spring Boot | Application framework |
| Spring Data JPA | Database operations |
| Hibernate | ORM |
| H2 Database | In-memory database |
| Maven | Build and dependency management |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |
| Git | Version control |
| GitHub | Source code repository |
| GitHub Codespaces | Development environment |

---

# 📁 Project Structure

```text
Auriga-Assesement/
│
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── auriga/
│   │   │           └── helpdesk/
│   │   │               ├── controller/
│   │   │               │   └── TicketController.java
│   │   │               ├── entity/
│   │   │               │   └── Ticket.java
│   │   │               ├── enums/
│   │   │               │   ├── Priority.java
│   │   │               │   └── Status.java
│   │   │               ├── repository/
│   │   │               │   └── TicketRepository.java
│   │   │               ├── service/
│   │   │               │   ├── TicketService.java
│   │   │               │   └── TicketEscalationService.java
│   │   │               └── HelpdeskApplication.java
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html
│   │       │   ├── style.css
│   │       │   └── app.js
│   │       └── application.properties
│   └── test/
│       └── java/
│
├── .gitattributes
├── .gitignore
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

---

# 🔌 REST API

## 1. Get All Tickets

```http
GET /api/tickets
```

Example:

```bash
curl http://localhost:8080/api/tickets
```

The response is paginated and automatically sorted according to the smart queue rules.

---

## 2. Pagination

```http
GET /api/tickets?page=0&size=10
```

Example:

```bash
curl "http://localhost:8080/api/tickets?page=0&size=10"
```

| Parameter | Description |
|---|---|
| page | Page number starting from 0 |
| size | Number of tickets per page |

---

## 3. Find Overdue Tickets

```http
GET /api/tickets?overdue=true
```

Example:

```bash
curl "http://localhost:8080/api/tickets?overdue=true"
```

---

## 4. Find Non-Overdue Tickets

```http
GET /api/tickets?overdue=false
```

Example:

```bash
curl "http://localhost:8080/api/tickets?overdue=false"
```

---

## 5. Filter by Priority

```http
GET /api/tickets?priority=URGENT
```

Available priorities:

```text
NORMAL
HIGH
URGENT
```

Example:

```bash
curl "http://localhost:8080/api/tickets?priority=URGENT"
```

---

## 6. Filter by Assignee

```http
GET /api/tickets?assignedTo=Priya
```

Example:

```bash
curl "http://localhost:8080/api/tickets?assignedTo=Priya"
```

The search is case-insensitive.

---

## 7. Search by Customer Name

```http
GET /api/tickets?customerName=ABC
```

Example:

```bash
curl "http://localhost:8080/api/tickets?customerName=ABC"
```

Customer search supports partial matching.

For example, `ABC` can match:

```text
ABC Corporation
ABC Technologies
My ABC Store
```

---

## 8. Combine Filters

Multiple filters can be used together.

```http
GET /api/tickets?priority=URGENT&assignedTo=Priya&overdue=true&page=0&size=10
```

Example:

```bash
curl "http://localhost:8080/api/tickets?priority=URGENT&assignedTo=Priya&overdue=true&page=0&size=10"
```

---

# ➕ Create a Ticket

## Request

```http
POST /api/tickets
Content-Type: application/json
```

### Example JSON

```json
{
  "customerName": "ABC Corporation",
  "title": "Laptop Issue",
  "description": "Employee laptop is not starting.",
  "priority": "URGENT",
  "status": "OPEN",
  "responseDeadline": "2026-09-17T10:00:00",
  "assignedTo": "Priya"
}
```

### Example cURL

```bash
curl -X POST http://localhost:8080/api/tickets \
-H "Content-Type: application/json" \
-d '{
  "customerName": "ABC Corporation",
  "title": "Laptop Issue",
  "description": "Employee laptop is not starting.",
  "priority": "URGENT",
  "status": "OPEN",
  "responseDeadline": "2026-09-17T10:00:00",
  "assignedTo": "Priya"
}'
```

---

# 🎫 Ticket Model

Each ticket contains:

| Field | Description |
|---|---|
| id | Unique ticket ID |
| customerName | Customer who raised the ticket |
| title | Ticket title |
| description | Detailed issue description |
| priority | NORMAL, HIGH, or URGENT |
| status | OPEN, IN_PROGRESS, RESOLVED, or CLOSED |
| responseDeadline | Agreed response deadline |
| assignedTo | Support agent |
| createdAt | Ticket creation timestamp |
| updatedAt | Last update timestamp |

---

# 🔄 Ticket Workflow

```text
              Customer
                  │
                  ▼
          ┌───────────────┐
          │ Create Ticket │
          └───────┬───────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Priority +        │
        │ Response Deadline │
        └─────────┬─────────┘
                  │
                  ▼
          ┌──────────────┐
          │ Smart Queue  │
          └──────┬───────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
    On Time             Overdue
        │                  │
        │                  ▼
        │           Priority Escalation
        │                  │
        │          NORMAL → HIGH
        │                  ↓
        │              → URGENT
        │                  │
        └────────┬─────────┘
                 ▼
          Support Agent
                 │
                 ▼
             Resolution
                 │
                 ▼
          RESOLVED / CLOSED
```

---

# ⏰ Scheduled Escalation

The application uses Spring Boot scheduling.

The escalation service runs every 60 seconds:

```java
@Scheduled(fixedRate = 60000)
public void escalateBreachedTickets()
```

It finds tickets where:

```text
responseDeadline < current time
```

and excludes:

```text
RESOLVED
CLOSED
```

The priority is then increased by one level.

---

# 🖥️ Web Dashboard

The application contains a simple web dashboard.

The dashboard includes:

### Dashboard

- Total Tickets
- Overdue Tickets
- Urgent Tickets
- My Tickets

### Ticket Management

- Customer search
- Priority filter
- Assignee filter
- Overdue filter
- Ticket table
- Pagination
- Refresh button
- Create Ticket button

### Team

Displays helpdesk team information.

---

# ▶️ How to Run

## Prerequisites

Install:

- Java 21
- Git

Maven does not need to be installed separately because the project includes the Maven Wrapper.

---

## Run in GitHub Codespaces

Open the terminal:

```bash
cd /workspaces/Auriga-Assesement
```

Run:

```bash
./mvnw spring-boot:run
```

The application starts on:

```text
http://localhost:8080
```

In GitHub Codespaces, open the forwarded **8080** port to access the dashboard.

---

# 🧪 Run Tests

Execute:

```bash
./mvnw clean test
```

A successful build should display:

```text
BUILD SUCCESS
```

---

# 🗄️ H2 Database

This project uses an H2 in-memory database.

Database configuration:

```properties
spring.datasource.url=jdbc:h2:mem:helpdesk
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
```

H2 Console:

```text
http://localhost:8080/h2-console
```

### H2 Console Login

```text
JDBC URL: jdbc:h2:mem:helpdesk
Username: sa
Password:
```

> The database is in-memory, so ticket data is cleared when the application is restarted.

---

# 🏗️ Architecture

The project follows a layered Spring Boot architecture.

```text
Frontend
   │
   ▼
REST Controller
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
H2 Database
```

### Controller

Handles HTTP requests and exposes REST endpoints.

```text
TicketController
```

### Service

Contains application/business logic.

```text
TicketService
TicketEscalationService
```

### Repository

Handles database operations and queue queries.

```text
TicketRepository
```

### Entity

Represents the ticket database table.

```text
Ticket
```

---

# 📌 Important Design Decisions

## Database-Level Queue Sorting

The smart queue ordering is handled in the backend repository query.

This ensures that the API itself always returns tickets in the correct order instead of depending only on frontend sorting.

---

## Pagination

Spring Data JPA's:

```java
Page<Ticket>
```

and:

```java
Pageable
```

are used to handle large ticket lists.

---

## Automatic Escalation

Spring's scheduled task automatically checks breached tickets without requiring manual action from the helpdesk team.

---

## Active Queue

Tickets with:

```text
RESOLVED
CLOSED
```

status are excluded from the active queue because they no longer require helpdesk attention.

---

# 🎯 Assessment Requirements

| Requirement | Status |
|---|---|
| Ticket priority | ✅ Implemented |
| Response deadline | ✅ Implemented |
| Urgent response deadline | ✅ Supported |
| Normal response deadline | ✅ Supported |
| Most pressing ticket first | ✅ Implemented |
| Overdue tickets first | ✅ Implemented |
| Priority ordering | ✅ Implemented |
| Deadline ordering | ✅ Implemented |
| Overdue filter | ✅ Implemented |
| Assigned-to-me filter | ✅ Implemented |
| Customer name lookup | ✅ Implemented |
| Pagination | ✅ Implemented |
| Automatic escalation | ✅ Implemented |
| NORMAL → HIGH → URGENT | ✅ Implemented |
| One-level escalation per run | ✅ Implemented |
| URGENT remains URGENT | ✅ Implemented |
| Resolved/closed not escalated | ✅ Implemented |
| REST API | ✅ Implemented |
| Web dashboard | ✅ Implemented |
| H2 database | ✅ Implemented |

---

# 🧪 Example Scenario

Suppose the helpdesk has these tickets:

```text
Ticket A
Priority: NORMAL
Deadline: Yesterday

Ticket B
Priority: URGENT
Deadline: Tomorrow

Ticket C
Priority: HIGH
Deadline: Tomorrow

Ticket D
Priority: NORMAL
Deadline: Tomorrow
```

The queue will prioritize the overdue ticket first:

```text
1. Ticket A → OVERDUE
2. Ticket B → URGENT
3. Ticket C → HIGH
4. Ticket D → NORMAL
```

If Ticket A remains overdue, the scheduler escalates:

```text
NORMAL
   ↓
HIGH
   ↓
URGENT
```

This ensures that a continuously breached ticket receives increasing priority.

---

# 🔮 Future Improvements

For a production-ready version, the following features could be added:

- PostgreSQL or MySQL database
- Authentication and authorization
- Role-based access control
- Update ticket API
- Delete ticket API
- Ticket assignment workflow
- Email notifications
- SMS notifications
- Priority change audit history
- Real-time updates using WebSockets
- Redis caching
- Advanced analytics
- Docker containerization
- CI/CD pipeline
- Cloud deployment

---

# 👨‍💻 Author

**Harsh Jindal**

Computer Science Engineering Student

---

# 📂 GitHub Repository

**Auriga-Assesement**

https://github.com/harshjindal203/Auriga-Assesement

---

# ⭐ Project Summary

The Smart Helpdesk Queue is designed to help a small IT support team manage a large number of tickets efficiently.

The core idea is simple:

```text
Identify the most pressing ticket
              ↓
Put it at the top of the queue
              ↓
Detect missed deadlines automatically
              ↓
Escalate priority
              ↓
Help the support team respond faster
```

The project combines a **Spring Boot REST backend**, **smart database-level queue ordering**, **automatic priority escalation**, **pagination**, **filtering**, and a **web-based dashboard** into one complete helpdesk solution.
