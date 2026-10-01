const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };
    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);
    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });
    if (ticket) {
      this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
    }
    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });
    if (ticket) {
      this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
    }
    return ticket;
  }
getNotificationsByTicketId(ticketId) {
    const ticket = this.repo.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return this.notificationService.getByTicketId(ticketId);
  }
  list(page, limit) {
    const tickets = this.repo.findAll();

    // Si no envían parámetros de paginación, retorna la lista completa por defecto
    if (!page || !limit) {
      return tickets;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 5;

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedTickets = tickets.slice(startIndex, endIndex);

    return {
      totalItems: tickets.length,
      totalPages: Math.ceil(tickets.length / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      data: paginatedTickets
    };
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new Error("Ticket no encontrado");
    }
    return true;
  }
}

module.exports = TicketService;