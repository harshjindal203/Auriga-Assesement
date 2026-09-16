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

Bilkul 👍 Main tumhe complete code fresh de raha hoon, taaki koi confusion na rahe. Tum 3 files ka pura code replace kar do:

src/main/resources/static/
├── index.html
├── style.css
└── app.js
1. index.html

Pura code replace karo:

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Smart Helpdesk</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <div class="brand">

            <div class="brand-icon">H</div>

            <div>
                <h2>Helpdesk</h2>
                <span>Support Center</span>
            </div>

        </div>

        <nav>

            <a href="#" class="nav-item active"
               onclick="showDashboard(event)">
                <span>▣</span>
                Dashboard
            </a>

            <a href="#ticketSection" class="nav-item"
               onclick="showTickets(event)">
                <span>▤</span>
                Tickets
            </a>

            <a href="#teamSection" class="nav-item"
               onclick="showTeam(event)">
                <span>◉</span>
                Team
            </a>

        </nav>

        <div class="sidebar-bottom">

            <div class="system-status">
                <span class="status-dot"></span>
                System Online
            </div>

        </div>

    </aside>


    <!-- MAIN CONTENT -->
    <main class="main">

        <!-- HEADER -->
        <header class="topbar">

            <div>
                <h1>Dashboard</h1>
                <p>Monitor and manage support tickets</p>
            </div>

            <button class="refresh-btn"
                    onclick="loadTickets()">
                ↻ Refresh
            </button>

        </header>


        <!-- STATISTICS -->
        <section class="stats-grid">

            <div class="stat-card">

                <div class="stat-icon blue">
                    ◫
                </div>

                <div>
                    <span>Total Tickets</span>
                    <strong id="totalTickets">0</strong>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon red">
                    !
                </div>

                <div>
                    <span>Overdue</span>
                    <strong id="overdueTickets">0</strong>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon orange">
                    ↑
                </div>

                <div>
                    <span>Urgent</span>
                    <strong id="urgentTickets">0</strong>
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon green">
                    ✓
                </div>

                <div>
                    <span>My Tickets</span>
                    <strong id="myTickets">0</strong>
                </div>

            </div>

        </section>


        <!-- FILTER PANEL -->
        <section class="filter-panel">

            <div class="filter-title">

                <h2>Ticket Queue</h2>

                <span id="queueInfo">
                    Loading...
                </span>

            </div>


            <div class="filters">

                <!-- CUSTOMER SEARCH -->

                <input
                    type="text"
                    id="customerSearch"
                    placeholder="Search customer..."
                    oninput="applyFilters()"
                >


                <!-- PRIORITY -->

                <select
                    id="priorityFilter"
                    onchange="applyFilters()">

                    <option value="">All Priority</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="NORMAL">Normal</option>

                </select>


                <!-- ASSIGNEE -->

                <select
                    id="assigneeFilter"
                    onchange="applyFilters()">

                    <option value="">All Assignees</option>
                    <option value="Priya">Priya</option>
                    <option value="Rahul">Rahul</option>

                </select>


                <!-- OVERDUE -->

                <select
                    id="overdueFilter"
                    onchange="applyFilters()">

                    <option value="">All Tickets</option>
                    <option value="true">Overdue</option>
                    <option value="false">Not Overdue</option>

                </select>

            </div>

        </section>


        <!-- TICKET TABLE -->

        <section class="table-card"
                 id="ticketSection">

            <div class="table-wrapper">

                <table>

                    <thead>

                    <tr>

                        <th>ID</th>
                        <th>CUSTOMER</th>
                        <th>ISSUE</th>
                        <th>PRIORITY</th>
                        <th>DEADLINE</th>
                        <th>ASSIGNED TO</th>
                        <th>STATUS</th>

                    </tr>

                    </thead>

                    <tbody id="ticketTable">

                    </tbody>

                </table>

            </div>


            <!-- PAGINATION -->

            <div class="pagination">

                <button
                    id="previousButton"
                    onclick="previousPage()">

                    ← Previous

                </button>


                <span id="pageNumber">
                    Page 1
                </span>


                <button
                    id="nextButton"
                    onclick="nextPage()">

                    Next →

                </button>

            </div>

        </section>


        <!-- TEAM SECTION -->

        <section class="team-section"
                 id="teamSection">

            <div class="team-header">

                <div>

                    <h2>Support Team</h2>

                    <p>
                        Helpdesk team members and their assigned workload
                    </p>

                </div>

            </div>


            <div class="team-grid">

                <div class="team-card">

                    <div class="team-avatar">
                        P
                    </div>

                    <div>

                        <h3>Priya</h3>

                        <span>
                            Support Agent
                        </span>

                    </div>

                </div>


                <div class="team-card">

                    <div class="team-avatar">
                        R
                    </div>

                    <div>

                        <h3>Rahul</h3>

                        <span>
                            Support Agent
                        </span>

                    </div>

                </div>

            </div>

        </section>

    </main>

</div>


<script src="app.js"></script>

</body>

</html>
2. style.css

Pura style.css bhi replace kar do:

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background: #f5f7fb;
    color: #172033;
}

.app {
    display: flex;
    min-height: 100vh;
}

/* ================= SIDEBAR ================= */

.sidebar {
    width: 240px;
    background: #111827;
    color: white;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 10px 30px;
    border-bottom: 1px solid #293241;
}

.brand-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 21px;
    font-weight: bold;
}

.brand h2 {
    font-size: 18px;
}

.brand span {
    color: #9ca3af;
    font-size: 12px;
}

nav {
    margin-top: 25px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #cbd5e1;
    text-decoration: none;
    padding: 12px 14px;
    border-radius: 8px;
    margin-bottom: 6px;
    font-size: 14px;
    cursor: pointer;
}

.nav-item.active {
    background: #2563eb;
    color: white;
}

.nav-item:hover {
    background: #1f2937;
}

.nav-item.active:hover {
    background: #2563eb;
}

.sidebar-bottom {
    margin-top: auto;
}

.system-status {
    color: #9ca3af;
    font-size: 13px;
    padding: 10px;
}

.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    margin-right: 7px;
}

/* ================= MAIN ================= */

.main {
    flex: 1;
    padding: 30px;
    min-width: 0;
}

.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
}

.topbar h1 {
    font-size: 30px;
    margin-bottom: 5px;
}

.topbar p {
    color: #6b7280;
    font-size: 14px;
}

.refresh-btn {
    border: none;
    background: #2563eb;
    color: white;
    padding: 11px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
}

.refresh-btn:hover {
    background: #1d4ed8;
}

/* ================= STATS ================= */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 24px;
}

.stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.stat-card span {
    display: block;
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 7px;
}

.stat-card strong {
    font-size: 27px;
}

.stat-icon {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
}

.stat-icon.blue {
    background: #dbeafe;
    color: #2563eb;
}

.stat-icon.red {
    background: #fee2e2;
    color: #dc2626;
}

.stat-icon.orange {
    background: #ffedd5;
    color: #ea580c;
}

.stat-icon.green {
    background: #dcfce7;
    color: #16a34a;
}

/* ================= FILTERS ================= */

.filter-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

.filter-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.filter-title h2 {
    font-size: 18px;
}

.filter-title span {
    color: #6b7280;
    font-size: 13px;
}

.filters {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 12px;
}

.filters input,
.filters select {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    color: #374151;
    outline: none;
    font-size: 14px;
}

.filters input:focus,
.filters select:focus {
    border-color: #2563eb;
}

/* ================= TABLE ================= */

.table-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 850px;
}

thead {
    background: #f8fafc;
}

th {
    text-align: left;
    padding: 14px 16px;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e5e7eb;
}

td {
    padding: 16px;
    border-bottom: 1px solid #eef0f3;
    font-size: 13px;
}

tbody tr:hover {
    background: #f8fafc;
}

.priority {
    font-weight: 700;
}

.priority.urgent {
    color: #dc2626;
}

.priority.high {
    color: #ea580c;
}

.priority.normal {
    color: #2563eb;
}

.overdue {
    color: #dc2626;
    font-weight: 700;
}

/* ================= STATUS ================= */

.status-badge {
    display: inline-block;
    padding: 5px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: #f1f5f9;
    color: #475569;
}

/* ================= PAGINATION ================= */

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 18px;
}

.pagination button {
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    padding: 9px 15px;
    border-radius: 7px;
    cursor: pointer;
}

.pagination button:hover:not(:disabled) {
    background: #f1f5f9;
}

.pagination button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.pagination span {
    color: #64748b;
    font-size: 13px;
}

/* ================= TEAM ================= */

.team-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    margin-top: 20px;
}

.team-header {
    margin-bottom: 20px;
}

.team-header h2 {
    font-size: 20px;
    margin-bottom: 5px;
}

.team-header p {
    color: #6b7280;
    font-size: 13px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.team-card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
}

.team-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #dbeafe;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
}

.team-card h3 {
    font-size: 15px;
    margin-bottom: 4px;
}

.team-card span {
    color: #6b7280;
    font-size: 12px;
}

/* ================= ERROR ================= */

.error-message {
    text-align: center;
    padding: 40px;
    color: #dc2626;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 1000px) {

    .sidebar {
        width: 200px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .filters {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 700px) {

    .sidebar {
        display: none;
    }

    .main {
        padding: 18px;
    }

    .topbar h1 {
        font-size: 24px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .filters {
        grid-template-columns: 1fr;
    }

    .team-grid {
        grid-template-columns: 1fr;
    }
}
3. app.js

Ab app.js ka pura code replace karo:

let currentPage = 0;

const pageSize = 10;


/* ================= LOAD TICKETS ================= */

async function loadTickets() {

    const customerName =
        document.getElementById("customerSearch").value.trim();

    const priority =
        document.getElementById("priorityFilter").value;

    const assignedTo =
        document.getElementById("assigneeFilter").value;

    const overdue =
        document.getElementById("overdueFilter").value;


    const params = new URLSearchParams();

    params.append("page", currentPage);
    params.append("size", pageSize);


    if (customerName) {
        params.append("customerName", customerName);
    }

    if (priority) {
        params.append("priority", priority);
    }

    if (assignedTo) {
        params.append("assignedTo", assignedTo);
    }

    if (overdue) {
        params.append("overdue", overdue);
    }


    try {

        const response =
            await fetch(`/api/tickets?${params.toString()}`);


        if (!response.ok) {
            throw new Error("Unable to load tickets");
        }


        const data =
            await response.json();


        displayTickets(data);


    } catch (error) {

        console.error("Error:", error);


        document.getElementById("ticketTable").innerHTML = `
            <tr>
                <td colspan="7" class="error-message">
                    Unable to load tickets.
                    Please refresh the page.
                </td>
            </tr>
        `;
    }
}


/* ================= DISPLAY TICKETS ================= */

function displayTickets(data) {

    const table =
        document.getElementById("ticketTable");


    table.innerHTML = "";


    let overdueCount = 0;

    let urgentCount = 0;

    let myTickets = 0;


    data.content.forEach(ticket => {


        const isOverdue =
            new Date(ticket.responseDeadline) < new Date();


        if (isOverdue) {
            overdueCount++;
        }


        if (ticket.priority === "URGENT") {
            urgentCount++;
        }


        if (ticket.assignedTo === "Priya") {
            myTickets++;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>#${ticket.id}</strong>
            </td>

            <td>
                ${escapeHtml(ticket.customerName)}
            </td>

            <td>
                <strong>
                    ${escapeHtml(ticket.title)}
                </strong>
            </td>

            <td>
                <span class="priority ${ticket.priority.toLowerCase()}">
                    ${ticket.priority}
                </span>
            </td>

            <td class="${isOverdue ? "overdue" : ""}">
                ${
                    isOverdue
                        ? "OVERDUE"
                        : formatDate(ticket.responseDeadline)
                }
            </td>

            <td>
                ${
                    ticket.assignedTo
                        ? escapeHtml(ticket.assignedTo)
                        : "Unassigned"
                }
            </td>

            <td>
                <span class="status-badge">
                    ${ticket.status}
                </span>
            </td>

        `;


        table.appendChild(row);

    });


    /* EMPTY STATE */

    if (data.content.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center; padding:40px;">
                    No tickets found
                </td>
            </tr>
        `;
    }


    /* STATISTICS */

    document.getElementById("totalTickets").textContent =
        data.totalElements;


    document.getElementById("overdueTickets").textContent =
        overdueCount;


    document.getElementById("urgentTickets").textContent =
        urgentCount;


    document.getElementById("myTickets").textContent =
        myTickets;


    /* QUEUE INFO */

    document.getElementById("queueInfo").textContent =
        `${data.totalElements} ticket${
            data.totalElements === 1 ? "" : "s"
        }`;


    /* PAGINATION */

    const totalPages =
        data.totalPages || 1;


    document.getElementById("pageNumber").textContent =
        `Page ${data.number + 1} of ${totalPages}`;


    document.getElementById("previousButton").disabled =
        data.first;


    document.getElementById("nextButton").disabled =
        data.last;
}


/* ================= FILTERS ================= */

function applyFilters() {

    currentPage = 0;

    loadTickets();
}


/* ================= PAGINATION ================= */

function nextPage() {

    currentPage++;

    loadTickets();
}


function previousPage() {

    if (currentPage > 0) {

        currentPage--;

        loadTickets();
    }
}


/* ================= DATE ================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString();
}


/* ================= SECURITY ================= */

function escapeHtml(value) {

    if (!value) {
        return "";
    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* ================= NAVIGATION ================= */

function setActiveNav(clickedItem) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    clickedItem.classList.add("active");
}


function showDashboard(event) {

    event.preventDefault();


    setActiveNav(event.currentTarget);


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


function showTickets(event) {

    event.preventDefault();


    setActiveNav(event.currentTarget);


    document
        .getElementById("ticketSection")
        .scrollIntoView({

            behavior: "smooth"

        });
}


function showTeam(event) {

    event.preventDefault();


    setActiveNav(event.currentTarget);


    document
        .getElementById("teamSection")
        .scrollIntoView({

            behavior: "smooth"

        });
}


/* ================= INITIAL LOAD ================= */

loadTickets();
Ab save karo

Teeno:

Ctrl + S
Phir browser refresh:
Ctrl + R

Ab:

Dashboard click → top par
Tickets click → ticket table par
Team click → Team section par
Refresh click → latest API data
Customer search → backend search
Priority → backend filter
Assignee → backend filter
Overdue → backend filter
Pagination → backend pagination
⚠️ Abhi database empty hai

Dashboard par 0 tickets dikhna normal hai, kyunki server restart ke baad H2 reset hua hai.

Abhi server ko restart mat karna. Browser refresh karke dekho ki dashboard same/properly load ho raha hai.

Uske baad next hum Add New Ticket form banayenge, jisse browser se hi ticket create hoga — curl ki zarurat nahi padegi.

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
