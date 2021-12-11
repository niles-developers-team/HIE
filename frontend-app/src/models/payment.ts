import { Benefactor, GetOptions, Validation } from ".";

export interface Payment
{
    id?: number;
    comment: string;
    amount: number;

    status: PaymentStatuses
    
    benefactor?: Benefactor;
    request?: Request;
}

export enum PaymentStatuses
{
    InProgress,
    Completed,
    Error
}

export namespace Payment {
    export const initial: Payment = {
        amount: 0,
        comment: '',
        status: PaymentStatuses.InProgress
    };
}

export interface PaymentGetOptions extends GetOptions {
    userId?: string;
}
export interface PaymentValidation extends Validation {
}
export namespace PaymentValidation {
    export const initial: PaymentValidation = Validation.initial;
}