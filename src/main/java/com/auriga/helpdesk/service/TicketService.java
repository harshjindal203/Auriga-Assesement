package com.auriga.helpdesk.service;

import com.auriga.helpdesk.entity.Ticket;
import com.auriga.helpdesk.enums.Priority;
import com.auriga.helpdesk.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Page<Ticket> getQueue(
            Boolean overdue,
            String assignedTo,
            String customerName,
            Priority priority,
            Pageable pageable) {

        return ticketRepository.findQueue(
                overdue,
                assignedTo,
                customerName,
                priority,
                pageable
        );
    }

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
}