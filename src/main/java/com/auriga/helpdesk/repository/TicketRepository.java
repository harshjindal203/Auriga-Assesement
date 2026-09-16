package com.auriga.helpdesk.repository;

import com.auriga.helpdesk.entity.Ticket;
import com.auriga.helpdesk.enums.Priority;
import com.auriga.helpdesk.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("""
        SELECT t FROM Ticket t
        WHERE t.status <> 'RESOLVED'
        AND t.status <> 'CLOSED'

        AND (
            :overdue IS NULL
            OR (:overdue = TRUE AND t.responseDeadline < CURRENT_TIMESTAMP)
            OR (:overdue = FALSE AND t.responseDeadline >= CURRENT_TIMESTAMP)
        )

        AND (
            :assignedTo IS NULL
            OR LOWER(t.assignedTo) = LOWER(:assignedTo)
        )

        AND (
            :customerName IS NULL
            OR LOWER(t.customerName) LIKE
               LOWER(CONCAT('%', :customerName, '%'))
        )

        AND (
            :priority IS NULL
            OR t.priority = :priority
        )

        ORDER BY

            CASE
                WHEN t.responseDeadline < CURRENT_TIMESTAMP
                THEN 0
                ELSE 1
            END,

            CASE
                WHEN t.priority = 'URGENT' THEN 0
                WHEN t.priority = 'HIGH' THEN 1
                ELSE 2
            END,

            t.responseDeadline ASC,
            t.createdAt ASC
    """)
    Page<Ticket> findQueue(
            @Param("overdue") Boolean overdue,
            @Param("assignedTo") String assignedTo,
            @Param("customerName") String customerName,
            @Param("priority") Priority priority,
            Pageable pageable
    );


    List<Ticket> findByResponseDeadlineBeforeAndStatusNotIn(
            LocalDateTime deadline,
            List<Status> statuses
    );
}