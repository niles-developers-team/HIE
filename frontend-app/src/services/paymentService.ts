import { Payment, PaymentGetOptions, PaymentValidation } from "../models";
import { handleJsonResponse, handleResponse, ResponseHandler } from "../utilities";

class PaymentService {
    public async get(options?: PaymentGetOptions): Promise<Payment[]> {
        let url = 'api/user';
        let conditionIndex: number = 0;
        if (options) {
            if (options.id)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
            if (options.ids)
                url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
            if (options.search !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
            if (options.benefactorId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}benefactorId=${options.benefactorId}`;
            if (options.benefactorId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}requestId=${options.requestId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Payment[]>);
    }

    public async create(model: Payment): Promise<Payment> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<Payment>);
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
    public validate(model: Payment): PaymentValidation {
        if (!model) return PaymentValidation.initial;


        const userErrors: PaymentValidation = {
            isValid: true
        };
        return userErrors;
    }
}

export const paymentService = new PaymentService();