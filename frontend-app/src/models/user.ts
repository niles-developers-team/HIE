import { Benefactor, Client, Validation } from ".";

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