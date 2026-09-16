Today 2:37 PM

ROUND 2  ·  BUILD ROUND
The helpdesk is drowning
Priya runs a two-person IT helpdesk and the queue never stops. Some tickets are ‘my laptop won’t boot before a client demo’ emergencies; others are ‘can I get a bigger monitor.’ Each ticket has a priority and an agreed response time — urgent within 2 hours, normal within a day — and Priya wants to always pick the most pressing ticket next, with anything past its promised time jumping to the front. She’s forever answering ‘what’s overdue?’ and ‘what’s assigned to me?’, and looking up a specific customer’s ticket by name. The list is huge, so she pages through it.
Build Priya something so the right ticket is always on top.
(The way Priya talks about her queue tells you what it needs — the ordering rule is the heart of it. Build it for any helpdesk, not just Priya’s. Get tickets and the queue order right first, then filters and assignment.)

This Round 2 problem is basically asking you to build a Helpdesk Ticket Management API/application where the ticket priority + overdue status determine the queue order.

Since this is a coding assessment, focus on getting the ordering logic correct first, then add filters, assignment, customer search, and pagination.

1. Understand the requirement

Each ticket can have:

id
customerName
title/description
priority → URGENT / NORMAL
responseDeadline
assignedTo
status → OPEN, IN_PROGRESS, RESOLVED

The most important rule is:

Any overdue ticket must come before non-overdue tickets. Among the remaining tickets, urgent tickets should come before normal tickets.

For example:

Ticket	Priority	Deadline	Overdue?	Queue
T101	NORMAL	10:00 AM	✅	1
T102	URGENT	12:00 PM	❌	2
T103	URGENT	2:00 PM	❌	3
T104	NORMAL	4:00 PM	❌	4

So the basic ordering becomes:

OVERDUE
   ↓
URGENT
   ↓
NORMAL
   ↓
EARLIER DEADLINE
Important

Don't simply sort:

URGENT → NORMAL

because an overdue NORMAL ticket must jump ahead of an URGENT ticket that is still within its promised response time.

2. Suggested database table

If you're using SQL, create something like:

CREATE TABLE tickets (
    id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    title VARCHAR(255),
    priority VARCHAR(20),
    status VARCHAR(30),
    response_deadline TIMESTAMP,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP
);

Example data:

INSERT INTO tickets
(id, customer_name, title, priority, status, response_deadline, assigned_to, created_at)
VALUES
(1, 'ABC Ltd', 'Laptop not booting', 'URGENT', 'OPEN',
 '2026-09-16 16:00:00', 'Priya', '2026-09-16 12:00:00'),

(2, 'XYZ Corp', 'Need bigger monitor', 'NORMAL', 'OPEN',
 '2026-09-16 13:00:00', 'Rahul', '2026-09-16 09:00:00'),

(3, 'Tech Solutions', 'VPN not working', 'URGENT', 'OPEN',
 '2026-09-16 18:00:00', 'Priya', '2026-09-16 13:00:00');
3. The HEART of Round 2 — Queue Ordering

If you're using SQL, the logic can be:

SELECT *
FROM tickets
WHERE status != 'RESOLVED'
ORDER BY
    CASE
        WHEN response_deadline < CURRENT_TIMESTAMP THEN 0
        ELSE 1
    END,
    CASE
        WHEN priority = 'URGENT' THEN 0
        ELSE 1
    END,
    response_deadline ASC;
What this does

First:

response_deadline < CURRENT_TIMESTAMP

checks whether the ticket is overdue.

Overdue:

0

Not overdue:

1

Since SQL sorts ascending, overdue tickets come first.

Then:

URGENT = 0
NORMAL = 1

So urgent tickets come before normal tickets within the same overdue/non-overdue group.

Finally:

response_deadline ASC

means the ticket with the earliest deadline comes first.

4. API endpoints you can build

A clean REST API structure:

GET    /api/tickets
GET    /api/tickets/{id}
POST   /api/tickets
PUT    /api/tickets/{id}
DELETE /api/tickets/{id}

GET    /api/tickets/overdue
GET    /api/tickets/assigned/{agent}
GET    /api/tickets/customer/{customerName}

But you can make it even cleaner by putting filters into the main endpoint:

GET /api/tickets?overdue=true
GET /api/tickets?assignedTo=Priya
GET /api/tickets?customerName=ABC
GET /api/tickets?priority=URGENT
5. Pagination

Because the problem specifically says:

"The list is huge, so she pages through it."

Your API should support:

GET /api/tickets?page=1&pageSize=10

SQL:

SELECT *
FROM tickets
WHERE status != 'RESOLVED'
ORDER BY
    CASE
        WHEN response_deadline < CURRENT_TIMESTAMP THEN 0
        ELSE 1
    END,
    CASE
        WHEN priority = 'URGENT' THEN 0
        ELSE 1
    END,
    response_deadline ASC
LIMIT 10 OFFSET 0;

For page 2:

LIMIT 10 OFFSET 10

General formula:

OFFSET = (page - 1) × pageSize
6. Recommended response

Your API can return:

{
  "page": 1,
  "pageSize": 10,
  "totalTickets": 35,
  "totalPages": 4,
  "tickets": [
    {
      "id": 2,
      "customerName": "XYZ Corp",
      "title": "Need bigger monitor",
      "priority": "NORMAL",
      "status": "OPEN",
      "responseDeadline": "2026-09-16T13:00:00",
      "assignedTo": "Rahul",
      "overdue": true
    }
  ]
}

The overdue field is particularly useful for the frontend.

7. If you're building this in Java/Spring Boot

A good project structure is:

helpdesk/
│
├── controller/
│     └── TicketController.java
│
├── service/
│     └── TicketService.java
│
├── repository/
│     └── TicketRepository.java
│
├── model/
│     └── Ticket.java
│
├── dto/
│     └── TicketResponse.java
│
└── HelpdeskApplication.java
Ticket model
@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String title;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime responseDeadline;

    private String assignedTo;

    private LocalDateTime createdAt;

    // getters and setters
}

Enums:

public enum Priority {
    URGENT,
    NORMAL
}
public enum Status {
    OPEN,
    IN_PROGRESS,
    RESOLVED
}
8. Repository ordering

For Spring Data JPA, you can implement the queue ordering with a custom query:

@Query("""
    SELECT t FROM Ticket t
    WHERE t.status <> 'RESOLVED'
    ORDER BY
      CASE WHEN t.responseDeadline < CURRENT_TIMESTAMP THEN 0 ELSE 1 END,
      CASE WHEN t.priority = 'URGENT' THEN 0 ELSE 1 END,
      t.responseDeadline ASC
""")
Page<Ticket> findQueue(Pageable pageable);

Then:

@GetMapping
public Page<Ticket> getTickets(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size);

    return ticketRepository.findQueue(pageable);
}
9. Filters

Then add:

Overdue
GET /api/tickets?overdue=true

Logic:

responseDeadline.isBefore(LocalDateTime.now())
Assigned to me
GET /api/tickets?assignedTo=Priya
Customer
GET /api/tickets?customerName=ABC

For partial customer-name search:

GET /api/tickets?customerName=abc

should find:

ABC Ltd
ABC Technologies
ABC Corporation
10. What I would implement first in the assessment

Don't spend the first 30 minutes making a beautiful UI.

Follow this order:

1. Create Ticket model
        ↓
2. Create database
        ↓
3. Create GET /tickets
        ↓
4. Implement QUEUE ORDERING ⭐
        ↓
5. Test overdue tickets
        ↓
6. Test urgent vs normal
        ↓
7. Add pagination
        ↓
8. Add overdue filter
        ↓
9. Add assigned-to filter
        ↓
10. Add customer search
        ↓
11. Add POST/UPDATE if required
        ↓
12. Basic frontend/UI
The interviewer is likely checking this especially:

Case 1

URGENT + not overdue
NORMAL + overdue

Expected:

NORMAL + overdue
URGENT + not overdue

Case 2

URGENT + overdue
NORMAL + overdue

Expected:

URGENT + overdue
NORMAL + overdue

Case 3

URGENT + not overdue
NORMAL + not overdue

Expected:

URGENT
NORMAL

That is the core logic of the entire problem. Get this working correctly first, then build the filters and pagination around it.

abe yeah hau
yeah 
yeah 
yeah aaya hai
yeah lo
Pasted text.txt
Document
yeah error aaya hau
old se yeah aaya hai
 yeah aaya haiu
yeah aaya hai 
yeah aaya h lekin isme refresh  tickets and teams par click nahi ho raha hai 
done these is woking 
hogya 

Haan, README.md ka pura code ek hi block mein de raha hoon. Isko direct README.md mein paste kar do:

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

Resolved and closed tickets are excluded from the active helpdesk queue.

⏱️ Automatic Priority Escalation

The system automatically checks for tickets whose response deadline has been breached.

Priority is increased one level per scheduled run:

NORMAL → HIGH → URGENT
HIGH → URGENT
URGENT → URGENT

Resolved and closed tickets are not escalated.

The escalation process runs automatically every 60 seconds.

Example

Suppose a ticket has:

Priority: NORMAL
Deadline: 10:00 AM
Current Time: 10:30 AM

After the escalation check:

NORMAL → HIGH

If the ticket remains overdue until the next escalation run:

HIGH → URGENT

Once the ticket reaches URGENT, it remains URGENT.

🛠️ Technology Stack
Technology	Purpose
Java 21	Backend development
Spring Boot	Application framework
Spring Data JPA	Database operations
Hibernate	ORM
H2 Database	In-memory database
Maven	Build and dependency management
HTML	Frontend structure
CSS	Frontend styling
JavaScript	Frontend functionality
Git	Version control
GitHub	Source code repository
GitHub Codespaces	Development environment
📁 Project Structure
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
🔌 REST API
1. Get All Tickets
GET /api/tickets

Example:

curl http://localhost:8080/api/tickets

The response is paginated and automatically sorted according to the smart queue rules.

2. Pagination
GET /api/tickets?page=0&size=10

Example:

curl "http://localhost:8080/api/tickets?page=0&size=10"
Parameter	Description
page	Page number starting from 0
size	Number of tickets per page
3. Find Overdue Tickets
GET /api/tickets?overdue=true

Example:

curl "http://localhost:8080/api/tickets?overdue=true"
4. Find Non-Overdue Tickets
GET /api/tickets?overdue=false

Example:

curl "http://localhost:8080/api/tickets?overdue=false"
5. Filter by Priority
GET /api/tickets?priority=URGENT

Available priorities:

NORMAL
HIGH
URGENT

Example:

curl "http://localhost:8080/api/tickets?priority=URGENT"
6. Filter by Assignee
GET /api/tickets?assignedTo=Priya

Example:

curl "http://localhost:8080/api/tickets?assignedTo=Priya"

The search is case-insensitive.

7. Search by Customer Name
GET /api/tickets?customerName=ABC

Example:

curl "http://localhost:8080/api/tickets?customerName=ABC"

Customer search supports partial matching.

For example, ABC can match:

ABC Corporation
ABC Technologies
My ABC Store
8. Combine Filters

Multiple filters can be used together.

GET /api/tickets?priority=URGENT&assignedTo=Priya&overdue=true&page=0&size=10

Example:

curl "http://localhost:8080/api/tickets?priority=URGENT&assignedTo=Priya&overdue=true&page=0&size=10"
➕ Create a Ticket
Request
POST /api/tickets
Content-Type: application/json
Example JSON
{
  "customerName": "ABC Corporation",
  "title": "Laptop Issue",
  "description": "Employee laptop is not starting.",
  "priority": "URGENT",
  "status": "OPEN",
  "responseDeadline": "2026-09-17T10:00:00",
  "assignedTo": "Priya"
}
Example cURL
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
🎫 Ticket Model

Each ticket contains:

Field	Description
id	Unique ticket ID
customerName	Customer who raised the ticket
title	Ticket title
description	Detailed issue description
priority	NORMAL, HIGH, or URGENT
status	OPEN, IN_PROGRESS, RESOLVED, or CLOSED
responseDeadline	Agreed response deadline
assignedTo	Support agent
createdAt	Ticket creation timestamp
updatedAt	Last update timestamp
🔄 Ticket Workflow
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
⏰ Scheduled Escalation

The application uses Spring Boot scheduling.

The escalation service runs every 60 seconds:

@Scheduled(fixedRate = 60000)
public void escalateBreachedTickets()

It finds tickets where:

responseDeadline < current time

and excludes:

RESOLVED
CLOSED

The priority is then increased by one level.

🖥️ Web Dashboard

The application contains a simple web dashboard.

The dashboard includes:

Dashboard
Total Tickets
Overdue Tickets
Urgent Tickets
My Tickets
Ticket Management
Customer search
Priority filter
Assignee filter
Overdue filter
Ticket table
Pagination
Refresh button
Create Ticket button
Team

Displays helpdesk team information.

▶️ How to Run
Prerequisites

Install:

Java 21
Git

Maven does not need to be installed separately because the project includes the Maven Wrapper.

Run in GitHub Codespaces

Open the terminal:

cd /workspaces/Auriga-Assesement

Run:

./mvnw spring-boot:run

The application starts on:

http://localhost:8080

In GitHub Codespaces, open the forwarded 8080 port to access the dashboard.

🧪 Run Tests

Execute:

./mvnw clean test

A successful build should display:

BUILD SUCCESS
🗄️ H2 Database

This project uses an H2 in-memory database.

Database configuration:

spring.datasource.url=jdbc:h2:mem:helpdesk
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

H2 Console:

http://localhost:8080/h2-console
H2 Console Login
JDBC URL: jdbc:h2:mem:helpdesk
Username: sa
Password:

The database is in-memory, so ticket data is cleared when the application is restarted.

🏗️ Architecture

The project follows a layered Spring Boot architecture.

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
Controller

Handles HTTP requests and exposes REST endpoints.

TicketController
Service

Contains application/business logic.

TicketService
TicketEscalationService
Repository

Handles database operations and queue queries.

TicketRepository
Entity

Represents the ticket database table.

Ticket
📌 Important Design Decisions
Database-Level Queue Sorting

The smart queue ordering is handled in the backend repository query.

This ensures that the API itself always returns tickets in the correct order instead of depending only on frontend sorting.

Pagination

Spring Data JPA's:

Page<Ticket>

and:

Pageable

are used to handle large ticket lists.

Automatic Escalation

Spring's scheduled task automatically checks breached tickets without requiring manual action from the helpdesk team.

Active Queue

Tickets with:

RESOLVED
CLOSED

status are excluded from the active queue because they no longer require helpdesk attention.

🎯 Assessment Requirements
Requirement	Status
Ticket priority	✅ Implemented
Response deadline	✅ Implemented
Urgent response deadline	✅ Supported
Normal response deadline	✅ Supported
Most pressing ticket first	✅ Implemented
Overdue tickets first	✅ Implemented
Priority ordering	✅ Implemented
Deadline ordering	✅ Implemented
Overdue filter	✅ Implemented
Assigned-to-me filter	✅ Implemented
Customer name lookup	✅ Implemented
Pagination	✅ Implemented
Automatic escalation	✅ Implemented
NORMAL → HIGH → URGENT	✅ Implemented
One-level escalation per run	✅ Implemented
URGENT remains URGENT	✅ Implemented
Resolved/closed not escalated	✅ Implemented
REST API	✅ Implemented
Web dashboard	✅ Implemented
H2 database	✅ Implemented
🧪 Example Scenario

Suppose the helpdesk has these tickets:

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

The queue will prioritize the overdue ticket first:

1. Ticket A → OVERDUE
2. Ticket B → URGENT
3. Ticket C → HIGH
4. Ticket D → NORMAL

If Ticket A remains overdue, the scheduler escalates:

NORMAL
   ↓
HIGH
   ↓
URGENT

This ensures that a continuously breached ticket receives increasing priority.

🔮 Future Improvements

For a production-ready version, the following features could be added:

PostgreSQL or MySQL database
Authentication and authorization
Role-based access control
Update ticket API
Delete ticket API
Ticket assignment workflow
Email notifications
SMS notifications
Priority change audit history
Real-time updates using WebSockets
Redis caching
Advanced analytics
Docker containerization
CI/CD pipeline
Cloud deployment
👨‍💻 Author

Harsh Jindal

Computer Science Engineering Student

📂 GitHub Repository

Auriga-Assesement

https://github.com/harshjindal203/Auriga-Assesement

⭐ Project Summary

The Smart Helpdesk Queue is designed to help a small IT support team manage a large number of tickets efficiently.

The core idea is simple:

Identify the most pressing ticket
              ↓
Put it at the top of the queue
              ↓
Detect missed deadlines automatically
              ↓
Escalate priority
              ↓
Help the support team respond faster

The project combines a Spring Boot REST backend, smart database-level queue ordering, automatic priority escalation, pagination, filtering, and a web-based dashboard into one complete helpdesk solution.


Save karke **ye final commands** chala dena:

```bash
git add README.md
git commit -m "Add project README"
git push origin main
Give me REASONING.md naam ki ek file banau aur mene joh bhi us problrms ke solution update kiye h voh dedo 

Haan. REASONING.md assessment ke liye useful rahegi, kyunki isme clearly explain hoga ki tumne problem ko kaise break kiya aur solution ke design decisions kya the.

Direct REASONING.md mein ye pura content paste karo:

# Reasoning & Solution Approach

## 1. Problem Understanding

The helpdesk problem is mainly a **ticket prioritization and response management problem**.

A small IT helpdesk may receive many tickets at the same time. Each ticket has:

- Customer
- Issue title
- Description
- Priority
- Response deadline
- Assigned support agent
- Status
- Creation time

The main challenge is to make sure the support team always knows:

> **Which ticket should be handled first?**

The solution therefore focuses on building a **Smart Helpdesk Queue**.

---

# 2. Breaking Down the Requirements

The problem was divided into the following major requirements:

```text
1. Store helpdesk tickets
2. Assign priority to tickets
3. Store agreed response deadline
4. Identify overdue tickets
5. Sort tickets by urgency
6. Search tickets by customer
7. Find tickets assigned to an agent
8. Filter tickets
9. Handle large ticket lists using pagination
10. Automatically escalate breached tickets
11. Provide a simple dashboard

This helped convert the business problem into smaller technical components.

3. Ticket Data Model

The first step was to decide what information a ticket needs.

The Ticket entity contains:

id
customerName
title
description
priority
status
responseDeadline
assignedTo
createdAt
updatedAt
Why these fields?
Customer Name

Required to identify the customer and support customer-based search.

Title

Provides a short description of the issue.

Description

Stores detailed information about the problem.

Priority

Represents how important the ticket currently is.

Available values:

NORMAL
HIGH
URGENT
Status

Represents the current state of the ticket.

Available values:

OPEN
IN_PROGRESS
RESOLVED
CLOSED
Response Deadline

Stores the agreed time by which the helpdesk should respond.

This field is important because the queue depends heavily on deadlines.

Assigned To

Stores the support agent responsible for the ticket.

This allows the system to answer:

What is assigned to me?

Created At

Stores when the ticket was created.

It is also used as a final tie-breaker when multiple tickets have the same urgency and deadline.

4. Priority Design

The system uses three priority levels:

NORMAL
HIGH
URGENT

Instead of relying only on priority, the system combines priority with the response deadline.

This is important because a NORMAL ticket whose deadline has already been breached can become more important than a future URGENT ticket.

Therefore:

Priority alone does not determine the queue position.

5. Smart Queue Ordering

The queue is the most important part of the solution.

The ordering logic is:

1. Overdue tickets first
2. URGENT before HIGH
3. HIGH before NORMAL
4. Earlier response deadline first
5. Older ticket first

The backend implements this ordering directly in the database query.

Conceptually:

                 ALL ACTIVE TICKETS
                         │
                         ▼
                ┌─────────────────┐
                │ Is ticket       │
                │ overdue?        │
                └────────┬────────┘
                         │
                 ┌───────┴───────┐
                 │               │
                YES              NO
                 │               │
                 ▼               ▼
            TOP OF QUEUE     NORMAL QUEUE
                 │               │
                 └───────┬───────┘
                         ▼
                    PRIORITY
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           URGENT       HIGH       NORMAL
                         │
                         ▼
                RESPONSE DEADLINE
                         │
                         ▼
                    CREATED TIME
6. Why Overdue Tickets Come First

The most important business rule is:

Anything past its promised response time should jump to the front.

For every active ticket, the system checks:

responseDeadline < current time

If this condition is true, the ticket is overdue.

Overdue tickets receive higher queue precedence.

Example:

Ticket A
Priority: NORMAL
Deadline: Yesterday
Ticket B
Priority: URGENT
Deadline: Tomorrow

The overdue ticket is placed first because its promised response time has already been breached.

This directly addresses the helpdesk's main problem.

7. Priority Ordering

After overdue status is considered, priority determines the next ordering level.

The order is:

URGENT
HIGH
NORMAL

Example:

Ticket A → HIGH
Ticket B → NORMAL
Ticket C → URGENT

Queue:

Ticket C → URGENT
Ticket A → HIGH
Ticket B → NORMAL
8. Deadline as a Tie-Breaker

Two tickets can have the same priority.

For example:

Ticket A
Priority: HIGH
Deadline: 4:00 PM

Ticket B
Priority: HIGH
Deadline: 2:00 PM

Ticket B should appear first because its response deadline is earlier.

Therefore, after priority:

Earlier deadline → Higher queue position
9. Created Time as Final Tie-Breaker

If two tickets have:

Same overdue status
Same priority
Same response deadline

then the older ticket should be handled first.

Therefore:

createdAt ASC

is used as the final ordering rule.

This creates a deterministic queue.

10. Active Ticket Filtering

Resolved and closed tickets no longer require active helpdesk attention.

Therefore the active queue excludes:

RESOLVED
CLOSED

The active queue contains tickets that still require action.

This also prevents completed tickets from being automatically escalated.

11. Automatic Escalation

The problem also requires automated escalation when the promised response time is breached.

The solution uses Spring Boot scheduling.

The scheduler runs every:

60 seconds

The system searches for tickets where:

responseDeadline < current time

and the status is not:

RESOLVED
CLOSED
12. One-Level Escalation Rule

A very important requirement is:

Priority should increase only one level per automated run.

The implemented logic is:

NORMAL → HIGH
HIGH → URGENT
URGENT → URGENT

It does NOT directly change:

NORMAL → URGENT

during one scheduler execution.

This ensures that each escalation represents one additional missed response interval/check.

13. Escalation Example

Suppose:

Ticket:
Priority = NORMAL
Status = OPEN
Deadline = 10:00 AM
Current Time = 10:30 AM

The ticket is overdue.

First scheduler run
NORMAL → HIGH
Next scheduler run

If the ticket is still overdue:

HIGH → URGENT
Later runs
URGENT → URGENT

The ticket never goes beyond URGENT.

14. Why Resolved and Closed Tickets Are Excluded

Suppose a ticket was:

Priority: NORMAL
Status: RESOLVED
Deadline: Yesterday

Even though its deadline has passed, it has already been completed.

It should not be escalated.

Therefore the escalation process explicitly excludes:

RESOLVED
CLOSED

This prevents unnecessary priority changes to completed tickets.

15. Repository-Level Queue Logic

The queue sorting is implemented in:

TicketRepository

instead of sorting only in JavaScript.

The repository query handles:

Overdue status
Priority
Deadline
Created time

This was an intentional design decision.

Reason

If sorting happened only in the frontend:

Database
   ↓
Unsorted API
   ↓
Frontend sorting

then different API consumers might receive different ordering.

Instead:

Database
   ↓
Backend queue query
   ↓
Correctly ordered API
   ↓
Frontend

This keeps the business rule inside the backend.

16. Pagination

The problem mentions that the helpdesk may have a huge number of tickets.

Returning every ticket at once would not be efficient.

Therefore pagination was implemented using Spring Data:

Page<Ticket>
Pageable

Example:

GET /api/tickets?page=0&size=10

This returns only a specific page of tickets.

Pagination allows the same queue logic to work with large datasets.

17. Filtering Requirements

The solution supports the following filters:

Customer
/api/tickets?customerName=ABC
Priority
/api/tickets?priority=URGENT
Assignee
/api/tickets?assignedTo=Priya
Overdue
/api/tickets?overdue=true

Filters can also be combined.

Example:

/api/tickets?priority=URGENT&assignedTo=Priya&overdue=true
18. Customer Ticket Lookup

The requirement asks for a way to find a customer's tickets by name.

The solution uses partial matching.

For example:

customerName=ABC

can find:

ABC Corporation
ABC Technologies
My ABC Store

The comparison is case-insensitive.

This makes customer lookup easier for helpdesk agents.

19. REST API Design

The backend exposes a simple REST API.

Get Tickets
GET /api/tickets
Create Ticket
POST /api/tickets

This separates the frontend from the backend business logic.

The frontend communicates with the Spring Boot API using HTTP requests.

20. Frontend Design

A simple web dashboard was created using:

HTML
CSS
JavaScript

No additional frontend framework was required.

The dashboard provides:

Dashboard
Tickets
Team

The ticket screen contains:

Customer Search
Priority Filter
Assignee Filter
Overdue Filter
Refresh
New Ticket
Ticket Table
Pagination

The frontend communicates with:

/api/tickets
21. Dashboard Statistics

The dashboard displays:

Total Tickets
Overdue
Urgent
My Tickets

These give the support agent a quick overview of the current queue.

22. Create Ticket Flow

The dashboard allows a user to create a new ticket.

The flow is:

Click "+ New Ticket"
        ↓
Enter customer information
        ↓
Enter issue details
        ↓
Select priority
        ↓
Select assignee
        ↓
Set response deadline
        ↓
Submit
        ↓
POST /api/tickets
        ↓
Ticket stored in database
        ↓
Queue refreshed
23. Database Choice

H2 was selected for this assessment.

Configuration:

jdbc:h2:mem:helpdesk
Reason

H2 provides:

Easy setup
No external database installation
Fast development
Simple testing
Easy GitHub Codespaces execution

For a production application, PostgreSQL or MySQL could replace H2.

24. Why Spring Boot

Spring Boot was selected because it provides:

REST API support
Dependency injection
JPA integration
Database integration
Scheduling
Easy application startup
Good project structure

The application uses:

Spring Boot
Spring Data JPA
Hibernate
Spring Scheduling
25. Application Architecture

The project follows a layered architecture:

┌─────────────────────────────┐
│       Web Dashboard         │
│      HTML/CSS/JavaScript    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      TicketController       │
│        REST API Layer       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       TicketService         │
│       Business Layer        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      TicketRepository       │
│       Data Access Layer     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        H2 Database          │
└─────────────────────────────┘

The escalation service works independently through the scheduled task:

Spring Scheduler
      ↓
TicketEscalationService
      ↓
Find breached tickets
      ↓
Increase priority
      ↓
Save changes
26. Why the Solution Works for the Helpdesk

The solution directly addresses the operational problem.

Without a smart queue:

Many Tickets
     ↓
Agent manually checks everything
     ↓
Overdue tickets can be missed
     ↓
Response delays

With the implemented solution:

Many Tickets
     ↓
Smart Queue
     ↓
Overdue tickets first
     ↓
Priority ordering
     ↓
Earlier deadlines first
     ↓
Automatic escalation
     ↓
Agent focuses on pressing tickets
27. Example Complete Scenario

Assume the helpdesk has four active tickets:

Ticket A
Customer: ABC
Priority: NORMAL
Deadline: Yesterday
Status: OPEN

Ticket B
Customer: XYZ
Priority: URGENT
Deadline: Tomorrow
Status: OPEN

Ticket C
Customer: PQR
Priority: HIGH
Deadline: Today
Status: OPEN

Ticket D
Customer: LMN
Priority: NORMAL
Deadline: Tomorrow
Status: OPEN

The queue initially considers overdue status first.

Therefore:

1. Ticket A → OVERDUE
2. Ticket B → URGENT
3. Ticket C → HIGH
4. Ticket D → NORMAL

The scheduled escalation then processes Ticket A:

NORMAL → HIGH

At the next scheduled run:

HIGH → URGENT

The queue now reflects the increased urgency.

28. Testing Performed

The application was tested for the important assessment requirements.

Application Startup
Spring Boot application starts successfully.
API
GET /api/tickets

was tested successfully.

Ticket Creation

New tickets can be created through the dashboard.

Overdue Filter

An overdue ticket was created and the overdue filter successfully displayed it.

Automatic Escalation

The automatic escalation was tested.

Observed behavior:

NORMAL → HIGH

and then:

HIGH → URGENT

This confirmed the one-level-per-run escalation requirement.

URGENT Limit

Once the ticket reached:

URGENT

it remained URGENT.

29. Development Environment

The project was developed using:

GitHub
GitHub Codespaces
VS Code
Java 21
Spring Boot
Maven

Repository:

Auriga-Assesement

The project is designed to run directly inside GitHub Codespaces.

30. Build and Run Commands
Run Tests
./mvnw clean test
Start Application
./mvnw spring-boot:run
Build Project
./mvnw clean package

Application URL:

http://localhost:8080
31. Final Solution

The final solution can be summarized as:

                    HELPdesk
                       │
                       ▼
                Create Ticket
                       │
                       ▼
             Priority + Deadline
                       │
                       ▼
                Smart Queue
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
      Overdue                    On Time
          │                         │
          ▼                         ▼
     Escalation               Priority Order
          │                         │
          └────────────┬────────────┘
                       ▼
                 Agent Queue
                       │
                       ▼
                  Resolution
                       │
                       ▼
                RESOLVED/CLOSED

The main principle of the implementation is:

The ticket with the most immediate response risk should be visible first.

The system achieves this through deadline-aware queue ordering, priority handling, automatic escalation, filtering, pagination, and a simple helpdesk dashboard.

32. Assessment Requirements Covered
Requirement	Implementation
Ticket priority	✅
Response deadline	✅
Urgent within 2 hours	✅ Supported
Normal within a day	✅ Supported
Most pressing ticket first	✅
Overdue tickets first	✅
Priority ordering	✅
Earliest deadline	✅
Customer lookup	✅
Assigned-to-me filter	✅
Overdue filter	✅
Pagination	✅
Automatic escalation	✅
NORMAL → HIGH	✅
HIGH → URGENT	✅
URGENT remains URGENT	✅
Resolved/Closed exclusion	✅
REST API	✅
Web dashboard	✅
H2 database	✅
33. Conclusion

The Smart Helpdesk Queue converts the helpdesk problem into a clear, automated workflow.

Instead of expecting agents to manually identify the most urgent tickets, the backend continuously applies the business rules:

Overdue first
      ↓
Priority
      ↓
Deadline
      ↓
Created time

When response deadlines are breached, the system automatically escalates the ticket:

NORMAL → HIGH → URGENT

The combination of:

Smart queue ordering
Automatic escalation
Filtering
Customer search
Assignee lookup
Pagination
REST APIs
Web dashboard

provides a complete solution for managing a busy helpdesk queue.


### Save karne ke baad

Codespace terminal mein:

```bash
git add REASONING.md
git commit -m "Add solution reasoning and design approach"
git push origin main

Isse evaluator ko sirf code nahi, tumhari problem-solving approach bhi clearly dikhegi.

file banakar dedo 

Done ✅ REASONING.md file ready hai.

📥 Download REASONING.md

Codespace mein add karne ke baad:

git add REASONING.md
git commit -m "Add solution reasoning"
git push origin main

Then evaluator ko README + REASONING + complete source code teeno mil jayenge. 

REASONING.md
Document
Your file library is full. New files won't be saved to your library, but you can still use them in this chat. To store new files for later, free up space or upgrade your storage.
Upgrade
Manage
