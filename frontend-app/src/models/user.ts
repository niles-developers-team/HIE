import { AutoPayment, Payment, Validation } from ".";

export interface User {
    id?: number;
    login: string;
    password?: string;
    email?: string;
    phone: string;
    client?: Client;
    benefactor?: Benefactor;

    followersCount: number;
    followsCount: number;
}

export interface Client {
    id?: number;
    kpp: string;
    inn: string;
    ogrn: string;
    personalBankAccount: string;
    approved: boolean;

    payments: Payment[];
    requests: Request[];
}

export interface CreateClient {
    login: string;
    password?: string;
    email?: string;
    contactPhone: string;
    kpp: string;
    inn: string;
    ogrn: string;
    personalBankAccount: string;
}

export interface CreateUser {
    login: string;
    password ?: string;
    email ?: string;
    phone: string;
}
export interface CreateClient extends CreateUser {
    kpp: string;
    inn: string;
    ogrn: string;
    personalBankAccount: string;
}

export interface CreateBenefactor extends CreateUser {
    alwaysPayComission: boolean;
}

export interface Benefactor {
    id?: number;
    level: number;
    alwaysPayComission: boolean;

    payments: Payment[];
    autoPayments: AutoPayment[];
}

export interface AuthenticatedUser extends User {
    token?: string;
}
export namespace User {
    export const initial: User = {
        email: '',
        phone: '',
        login: '',
        followersCount: 0,
        followsCount: 0
    }
}

export interface UserAuthenticateOptions {
    phone: string;
    email: string;
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