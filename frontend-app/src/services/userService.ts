import { handleJsonResponse, ResponseHandler, handleResponse } from "../utilities";
import { AuthenticatedUser, User, UserAuthenticateOptions, GetOptions, UserValidation } from "../models";
import { sessionService } from "./sessionService";

class UserService {
    public async signin(options: UserAuthenticateOptions): Promise<AuthenticatedUser> {
        return fetch('api/user/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public signout() {
        sessionService.signOut();
    }

    public async create(user: User): Promise<User> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public async update(user: User): Promise<User> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(handleJsonResponse as ResponseHandler<AuthenticatedUser>);
    }

    public async get(options?: GetOptions): Promise<User[]> {
        let url = 'api/user';
        let conditionIndex: number = 0;
        if (options) {
            if (options.id)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
            if (options.ids)
                url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
            if (options.search !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<User[]>);
    }

    public async delete(ids: number[]): Promise<void> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        })
            .then(handleResponse);
    }

    public async follow(followerId: number, followedId: number): Promise<void> {
        return fetch('api/user/follow', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerId, followedId })
        })
            .then(handleResponse);
    }

    private validateFirstname(firstname: string): string {
        const firstnameValid = Boolean(firstname);
        return firstnameValid ? '' : 'Имя пользователя обязательно';
    }

    private validateLastname(lastname: string): string {
        const lastnameValid = Boolean(lastname);
        return lastnameValid ? '' : 'Фамилия пользователя обязательна';
    }

    private validateUsername(username: string): string {
        const usernameValid = username && username.length >= 5;
        return usernameValid ? '' : 'Логин должен быть длиннее 5 символов';
    }

    private validatePassword(password: string): string {
        const passwordValid = password && password.length >= 5;
        return passwordValid ? '' : 'Пароль должен быть длиннее 5 символов';
    }

    private validateEmail(email: string): string {
        const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        return emailValid ? '' : 'Невалидный email адрес';
    }

    public validateCredentials(username: string, password: string): UserValidation {
        const usernameError = this.validateUsername(username);
        const passwordError = this.validatePassword(password);
        const isValid = !usernameError && !passwordError;

        const userErrors: UserValidation = {
            usernameError: this.validateUsername(username),
            passwordError: this.validatePassword(password),
            isValid: isValid
        };
        return userErrors;
    }

    public validateUser(user: User) {
        if (!user) return UserValidation.initial;

        const firstnameError = this.validateFirstname(user.firstname);
        const lastnameError = this.validateLastname(user.lastname);
        const usernameError = this.validateUsername(user.username);
        const passwordError = user.id ? '' : this.validatePassword(user.password);
        const emailError = this.validateEmail(user.email);
        const isValid = !firstnameError
            && !lastnameError
            && !usernameError
            && !passwordError
            && !emailError;

        const userErrors: UserValidation = {
            firstnameError: firstnameError,
            lastnameError: lastnameError,
            usernameError: usernameError,
            passwordError: passwordError,
            emailError: emailError,
            isValid: isValid
        };
        return userErrors;
    }
}

export const userService = new UserService();