export type TransactionStatus = 'pending' | 'closed' | 'expired' | 'withdrawn' | 'off_market' | 'other';
export type TransactionType = 'sale' | 'rent' | 'lease' | 'buy' | 'other';

export interface Transaction {
    id: number;
    userId: number;
    propertyId?: number;
    status: TransactionStatus;
    type: TransactionType;
    notes?: string;
    description?: string;
    created: Date;
    updated: Date;
    viewed?: Date;
}
