export type PaymentType = 'PIX' | 'Cartão' | 'Dinheiro' | 'Outro';

export interface Registration {
  id: string;
  name: string;   // Nome
  phone: string;  // Telefone/WhatsApp
  paymentType: PaymentType | ''; // Tipo de Pagamento
  createdAt: string; // ISO (não é gravado na planilha, mas pode ajudar em logs)
}
