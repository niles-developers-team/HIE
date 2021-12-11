import { AutoPayment, Payment, Validation } from ".";

export interface User {
    id?: number;
    login: string;
    password?: string;
    email?: string;
    contactPhone: string;
    client?: Client;
    benefactor?: Benefactor;

    followersCount: number;
    followsCount: number;
}

export interface Client {
    id?: number;
    bill: string;
    inn: string;
    approved: boolean;

    payments: Payment[];
    requests: Request[];
}

export interface Benefactor {
    id?: number;
    level: number;
    alwaysCommisionToService: boolean;

    payments: Payment[];
    autoPayments: AutoPayment[];
}

export interface AuthenticatedUser extends User {
    token?: string;
}
export namespace User {
    export const initial: User = {
        email: '',
        contactPhone: '',
        login: '',
        followersCount: 0,
        followsCount: 0
    }
}

export interface UserAuthenticateOptions {
    login: string;
    password: string;
}

export interface UserValidation extends Validation {
    emailError?: string;
    loginError?: string;
    passwordError?: string;
    firstnameError?: string;
    lastnameError?: string;
}

export namespace UserValidation {
    export const initial: UserValidation = Validation.initial;
}