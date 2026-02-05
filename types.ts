export type TicketType = 'adult' | 'child_6_10' | 'child_0_5';

export interface Registration {
  id: string;
  name: string;
  phone: string;
  ticketType: TicketType;
  createdAt: string; // ISO
}
