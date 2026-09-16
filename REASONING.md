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
```

This helped convert the business problem into smaller technical components.

---

# 3. Ticket Data Model

The `Ticket` entity contains:

```text
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
```

### Why these fields?

- **Customer Name:** Used to identify customers and search tickets.
- **Title:** Short description of the issue.
- **Description:** Detailed issue information.
- **Priority:** Current urgency of the ticket.
- **Status:** Current state of the ticket.
- **Response Deadline:** Agreed time by which the helpdesk should respond.
- **Assigned To:** Support agent responsible for the ticket.
- **Created At:** Used for tracking and tie-breaking.
- **Updated At:** Tracks the latest update time.

Priority values:

```text
NORMAL
HIGH
URGENT
```

Status values:

```text
OPEN
IN_PROGRESS
RESOLVED
CLOSED
```

---

# 4. Priority Design

The system uses three priority levels:

```text
NORMAL
HIGH
URGENT
```

Priority is not the only factor used to determine queue position.

A NORMAL ticket that has already breached its response deadline can become more pressing than an URGENT ticket whose deadline is still in the future.

Therefore:

> **Priority is combined with deadline information to determine the queue.**

---

# 5. Smart Queue Ordering

The queue is the most important part of the solution.

The ordering logic is:

```text
1. Overdue tickets first
2. URGENT before HIGH
3. HIGH before NORMAL
4. Earlier response deadline first
5. Older ticket first
```

Conceptually:

```text
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
```

---

# 6. Why Overdue Tickets Come First

The main business rule is:

> Anything past its promised response time should jump to the front.

For every active ticket, the system checks:

```text
responseDeadline < current time
```

If this condition is true, the ticket is overdue.

Overdue tickets receive higher queue precedence.

Example:

```text
Ticket A
Priority: NORMAL
Deadline: Yesterday
```

```text
Ticket B
Priority: URGENT
Deadline: Tomorrow
```

The overdue ticket is placed first because its promised response time has already been breached.

---

# 7. Priority Ordering

After overdue status is considered, priority determines the next ordering level.

The order is:

```text
URGENT
HIGH
NORMAL
```

Example:

```text
Ticket A → HIGH
Ticket B → NORMAL
Ticket C → URGENT
```

Queue:

```text
Ticket C → URGENT
Ticket A → HIGH
Ticket B → NORMAL
```

---

# 8. Deadline as a Tie-Breaker

Two tickets can have the same priority.

Example:

```text
Ticket A
Priority: HIGH
Deadline: 4:00 PM

Ticket B
Priority: HIGH
Deadline: 2:00 PM
```

Ticket B appears first because its response deadline is earlier.

Therefore:

```text
Earlier deadline → Higher queue position
```

---

# 9. Created Time as Final Tie-Breaker

If two tickets have:

```text
Same overdue status
Same priority
Same response deadline
```

then the older ticket should be handled first.

Therefore:

```text
createdAt ASC
```

is used as the final ordering rule.

This makes the queue deterministic.

---

# 10. Active Ticket Filtering

Resolved and closed tickets no longer require active helpdesk attention.

Therefore the active queue excludes:

```text
RESOLVED
CLOSED
```

This also prevents completed tickets from being automatically escalated.

---

# 11. Automatic Escalation

The problem requires automated escalation when the promised response time is breached.

The solution uses Spring Boot scheduling.

The scheduler runs every:

```text
60 seconds
```

The system searches for tickets where:

```text
responseDeadline < current time
```

and the status is not:

```text
RESOLVED
CLOSED
```

---

# 12. One-Level Escalation Rule

Priority increases only one level per automated run.

The implemented logic is:

```text
NORMAL → HIGH
HIGH → URGENT
URGENT → URGENT
```

The system does not directly change:

```text
NORMAL → URGENT
```

during a single scheduler execution.

This satisfies the one-level-per-run escalation requirement.

---

# 13. Escalation Example

Suppose:

```text
Priority = NORMAL
Status = OPEN
Deadline = 10:00 AM
Current Time = 10:30 AM
```

The ticket is overdue.

### First scheduler run

```text
NORMAL → HIGH
```

### Next scheduler run

If the ticket is still overdue:

```text
HIGH → URGENT
```

### Later runs

```text
URGENT → URGENT
```

The ticket never goes beyond URGENT.

---

# 14. Why Resolved and Closed Tickets Are Excluded

Suppose:

```text
Priority: NORMAL
Status: RESOLVED
Deadline: Yesterday
```

Even though the deadline has passed, the ticket has already been completed.

It should not be escalated.

Therefore the escalation process explicitly excludes:

```text
RESOLVED
CLOSED
```

---

# 15. Repository-Level Queue Logic

The queue sorting is implemented in:

```text
TicketRepository
```

The repository query handles:

```text
Overdue status
Priority
Deadline
Created time
```

This was an intentional design decision.

### Reason

If sorting happened only in the frontend:

```text
Database
   ↓
Unsorted API
   ↓
Frontend sorting
```

different API consumers could receive different ordering.

Instead:

```text
Database
   ↓
Backend queue query
   ↓
Correctly ordered API
   ↓
Frontend
```

The business rule therefore remains in the backend.

---

# 16. Pagination

The problem mentions that the helpdesk may have a huge number of tickets.

Returning every ticket at once would not be efficient.

Therefore pagination was implemented using Spring Data:

```text
Page<Ticket>
Pageable
```

Example:

```http
GET /api/tickets?page=0&size=10
```

This returns a specific page of tickets.

Pagination allows the same queue logic to work with large datasets.

---

# 17. Filtering Requirements

The solution supports:

### Customer

```http
/api/tickets?customerName=ABC
```

### Priority

```http
/api/tickets?priority=URGENT
```

### Assignee

```http
/api/tickets?assignedTo=Priya
```

### Overdue

```http
/api/tickets?overdue=true
```

Filters can also be combined.

Example:

```http
/api/tickets?priority=URGENT&assignedTo=Priya&overdue=true
```

---

# 18. Customer Ticket Lookup

The requirement asks for a way to find a customer's tickets by name.

The solution uses partial, case-insensitive matching.

For example:

```text
customerName=ABC
```

can find:

```text
ABC Corporation
ABC Technologies
My ABC Store
```

This makes customer lookup easier for helpdesk agents.

---

# 19. REST API Design

The backend exposes a simple REST API.

### Get Tickets

```http
GET /api/tickets
```

### Create Ticket

```http
POST /api/tickets
```

The frontend communicates with the Spring Boot API using HTTP requests.

---

# 20. Frontend Design

A simple web dashboard was created using:

```text
HTML
CSS
JavaScript
```

The dashboard provides:

```text
Dashboard
Tickets
Team
```

The ticket screen contains:

```text
Customer Search
Priority Filter
Assignee Filter
Overdue Filter
Refresh
New Ticket
Ticket Table
Pagination
```

The frontend communicates with:

```text
/api/tickets
```

---

# 21. Dashboard Statistics

The dashboard displays:

```text
Total Tickets
Overdue
Urgent
My Tickets
```

These provide a quick overview of the current queue.

---

# 22. Create Ticket Flow

The dashboard allows a user to create a new ticket.

The flow is:

```text
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
```

---

# 23. Database Choice

H2 was selected for this assessment.

Configuration:

```text
jdbc:h2:mem:helpdesk
```

### Reason

H2 provides:

- Easy setup
- No external database installation
- Fast development
- Simple testing
- Easy GitHub Codespaces execution

For production, PostgreSQL or MySQL could replace H2.

---

# 24. Why Spring Boot

Spring Boot was selected because it provides:

- REST API support
- Dependency injection
- JPA integration
- Database integration
- Scheduling
- Easy application startup
- Clean project structure

The application uses:

```text
Spring Boot
Spring Data JPA
Hibernate
Spring Scheduling
```

---

# 25. Application Architecture

The project follows a layered architecture:

```text
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
```

The escalation service works independently through the scheduled task:

```text
Spring Scheduler
      ↓
TicketEscalationService
      ↓
Find breached tickets
      ↓
Increase priority
      ↓
Save changes
```

---

# 26. Why the Solution Works for the Helpdesk

Without a smart queue:

```text
Many Tickets
     ↓
Agent manually checks everything
     ↓
Overdue tickets can be missed
     ↓
Response delays
```

With the implemented solution:

```text
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
```

---

# 27. Example Complete Scenario

Assume the helpdesk has four active tickets:

```text
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
```

The queue considers overdue status first.

Therefore:

```text
1. Ticket A → OVERDUE
2. Ticket B → URGENT
3. Ticket C → HIGH
4. Ticket D → NORMAL
```

The scheduled escalation processes Ticket A:

```text
NORMAL → HIGH
```

At the next scheduled run:

```text
HIGH → URGENT
```

---

# 28. Testing Performed

The application was tested for important assessment requirements.

### Application Startup

The Spring Boot application starts successfully.

### API

```text
GET /api/tickets
```

was tested successfully.

### Ticket Creation

New tickets can be created through the dashboard.

### Overdue Filter

An overdue ticket was created and the overdue filter successfully displayed it.

### Automatic Escalation

The automatic escalation was tested.

Observed behavior:

```text
NORMAL → HIGH
```

and then:

```text
HIGH → URGENT
```

This confirmed the one-level-per-run escalation requirement.

### URGENT Limit

Once the ticket reached:

```text
URGENT
```

it remained URGENT.

---

# 29. Development Environment

The project was developed using:

```text
GitHub
GitHub Codespaces
VS Code
Java 21
Spring Boot
Maven
```

Repository:

```text
Auriga-Assesement
```

The project is designed to run directly inside GitHub Codespaces.

---

# 30. Build and Run Commands

### Run Tests

```bash
./mvnw clean test
```

### Start Application

```bash
./mvnw spring-boot:run
```

### Build Project

```bash
./mvnw clean package
```

Application URL:

```text
http://localhost:8080
```

---

# 31. Final Solution

The final solution can be summarized as:

```text
                    HELPDESK
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
```

The main principle of the implementation is:

> **The ticket with the most immediate response risk should be visible first.**

The system achieves this through deadline-aware queue ordering, priority handling, automatic escalation, filtering, pagination, and a simple helpdesk dashboard.

---

# 32. Assessment Requirements Covered

| Requirement | Implementation |
|---|---|
| Ticket priority | ✅ |
| Response deadline | ✅ |
| Urgent within 2 hours | ✅ Supported |
| Normal within a day | ✅ Supported |
| Most pressing ticket first | ✅ |
| Overdue tickets first | ✅ |
| Priority ordering | ✅ |
| Earliest deadline | ✅ |
| Customer lookup | ✅ |
| Assigned-to-me filter | ✅ |
| Overdue filter | ✅ |
| Pagination | ✅ |
| Automatic escalation | ✅ |
| NORMAL → HIGH | ✅ |
| HIGH → URGENT | ✅ |
| URGENT remains URGENT | ✅ |
| Resolved/Closed exclusion | ✅ |
| REST API | ✅ |
| Web dashboard | ✅ |
| H2 database | ✅ |

---

# 33. Conclusion

The Smart Helpdesk Queue converts the helpdesk problem into a clear, automated workflow.

Instead of expecting agents to manually identify the most urgent tickets, the backend continuously applies the business rules:

```text
Overdue first
      ↓
Priority
      ↓
Deadline
      ↓
Created time
```

When response deadlines are breached, the system automatically escalates the ticket:

```text
NORMAL → HIGH → URGENT
```

The combination of:

- Smart queue ordering
- Automatic escalation
- Filtering
- Customer search
- Assignee lookup
- Pagination
- REST APIs
- Web dashboard

provides a complete solution for managing a busy helpdesk queue.
