// Types
export interface Payment {
  _id: string;
  userId: string;
  provider: string;
  transactionId: string;
  amount: number;
  status: string;
  currency: string;
  productId: string;
  jobApplicationId?: string;
  bookingId?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  couponCode?: string;
  clientSecret?: string;
  metadata?: Record<string, any>;
  webhookReceived: boolean;
  receiptUrl?: string;
  productType: string;
  bookingService?: string;
  platformRole: string;
  profileId?: string;
  isSession: boolean;
  isClassroom: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}
