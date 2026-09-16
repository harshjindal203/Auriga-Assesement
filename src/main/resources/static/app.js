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

        const data = await response.json();

        displayTickets(data);

    } catch (error) {

        console.error(error);

        document.getElementById("ticketTable").innerHTML = `
            <tr>
                <td colspan="7" class="error-message">
                    Unable to load tickets. Please refresh.
                </td>
            </tr>
        `;
    }
}


/* ================= DISPLAY ================= */

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


    document.getElementById("totalTickets").textContent =
        data.totalElements;

    document.getElementById("overdueTickets").textContent =
        overdueCount;

    document.getElementById("urgentTickets").textContent =
        urgentCount;

    document.getElementById("myTickets").textContent =
        myTickets;


    document.getElementById("queueInfo").textContent =
        `${data.totalElements} ticket${
            data.totalElements === 1 ? "" : "s"
        }`;


    const totalPages = data.totalPages || 1;

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

    return new Date(dateString).toLocaleString();
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

    document.querySelectorAll(".nav-item")
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

    document.getElementById("ticketSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function showTeam(event) {

    event.preventDefault();

    setActiveNav(event.currentTarget);

    document.getElementById("teamSection")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ================= CREATE TICKET ================= */

function openTicketModal() {

    document.getElementById("ticketModal")
        .classList.add("show");
}


function closeTicketModal() {

    document.getElementById("ticketModal")
        .classList.remove("show");

    document.getElementById("ticketForm")
        .reset();
}


document.getElementById("ticketForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const ticket = {

            customerName:
                document.getElementById("newCustomerName").value.trim(),

            title:
                document.getElementById("newTitle").value.trim(),

            description:
                document.getElementById("newDescription").value.trim(),

            priority:
                document.getElementById("newPriority").value,

            status: "OPEN",

            responseDeadline:
                document.getElementById("newDeadline").value,

            assignedTo:
                document.getElementById("newAssignedTo").value
        };


        try {

            const response =
                await fetch("/api/tickets", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(ticket)

                });


            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }


            closeTicketModal();

            currentPage = 0;

            await loadTickets();

            alert("Ticket created successfully!");


        } catch (error) {

            console.error(error);

            alert("Unable to create ticket.");

        }

    });


/* ================= INITIAL LOAD ================= */

loadTickets();