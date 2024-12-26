export interface TicketData {
  firstName: string;
  lastName: string;
  email: string;
  numberOfTickets: number;
}

export interface QRCodeData extends TicketData {
  ticketId: string;
  timestamp: string;
  validationStatus: 'unused';
}

export interface EventInfo {
  event_date: string;
  location: string;
  address: string;
}