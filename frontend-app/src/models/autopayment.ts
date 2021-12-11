import { Benefactor, Client } from ".";

export interface AutoPayment
{
    id?: number;
    amount: number;
    period: number;
    
    benefactor: Benefactor;
    client?: Client;
}