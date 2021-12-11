import { Payment, Validation } from ".";

export interface User {
    id?: number;
    login: string;
    password?: string;
    email: string;
    contactPhone: string;

    client?: Client;
    benefactor?: Benefactor;
    followers: User[];
    follows: User[];
}

export interface Client extends User {
    bill: string;
    inn: string;
    approved: boolean;

    payments: Payment[];
    requests: Request[];
}

export interface Benefactor extends User {
    id?: number;
    level: number;
    alwaysCommisionToService: boolean;

    payments: Payment[];
}

export interface AuthenticatedUser extends User {
    token?: string;
}
export namespace User {
    export const initial: User = {
        email: '',
        contactPhone: '',
        login: '',
        followers: [],
        follows: []
    }
}

export interface UserAuthenticateOptions {
    login: string;
    password: string;
    rememberMe: boolean;
}

export interface UserValidation extends Validation {
    emailError?: string;
    usernameError?: string;
    passwordError?: string;
    firstnameError?: string;
    lastnameError?: string;
}

export namespace UserValidation {
    export const initial: UserValidation = Validation.initial;
}