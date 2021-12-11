import { Benefactor, Client, GetOptions, Validation } from ".";

export interface Payment {
    id?: number;
    comment: string;
    amount: number;

    status: PaymentStatuses

    benefactor?: Benefactor;
    client?: Client;
    request?: Request;
}

export enum PaymentStatuses {
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
    benefactorId?: number;
    requestId?: number;
}
export interface PaymentValidation extends Validation {
    benefactorError?: string;
}
export namespace PaymentValidation {
    export const initial: PaymentValidation = Validation.initial;
}