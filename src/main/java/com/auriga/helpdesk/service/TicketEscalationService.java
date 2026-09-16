package com.auriga.helpdesk.service;

import com.auriga.helpdesk.entity.Ticket;
import com.auriga.helpdesk.enums.Priority;
import com.auriga.helpdesk.enums.Status;
import com.auriga.helpdesk.repository.TicketRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketEscalationService {

    private final TicketRepository ticketRepository;

    public TicketEscalationService(
            TicketRepository ticketRepository) {

        this.ticketRepository = ticketRepository;
    }


    @Scheduled(fixedRate = 60000)
    public void escalateBreachedTickets() {

        LocalDateTime now = LocalDateTime.now();


        List<Ticket> breachedTickets =
                ticketRepository
                        .findByResponseDeadlineBeforeAndStatusNotIn(
                                now,
                                List.of(
                                        Status.RESOLVED,
                                        Status.CLOSED
                                )
                        );


        for (Ticket ticket : breachedTickets) {


            if (ticket.getPriority() == Priority.NORMAL) {

                ticket.setPriority(Priority.HIGH);

            }

            else if (ticket.getPriority() == Priority.HIGH) {

                ticket.setPriority(Priority.URGENT);

            }

            // URGENT stays URGENT.


            ticketRepository.save(ticket);
        }
    }
}