package com.auriga.helpdesk.controller;

import com.auriga.helpdesk.entity.Ticket;
import com.auriga.helpdesk.enums.Priority;
import com.auriga.helpdesk.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public Page<Ticket> getTickets(

            @RequestParam(required = false)
            Boolean overdue,

            @RequestParam(required = false)
            String assignedTo,

            @RequestParam(required = false)
            String customerName,

            @RequestParam(required = false)
            Priority priority,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return ticketService.getQueue(
                overdue,
                assignedTo,
                customerName,
                priority,
                pageable
        );
    }


    @PostMapping
    public Ticket createTicket(
            @RequestBody Ticket ticket) {

        return ticketService.createTicket(ticket);
    }
}