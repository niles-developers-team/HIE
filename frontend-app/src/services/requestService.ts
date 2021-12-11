import { ClientRequest, ClientRequestGetOptions, ClientRequestValidation } from "../models";
import { handleJsonResponse, ResponseHandler, handleResponse } from "../utilities";

class RequestService {
    public async get(options?: ClientRequestGetOptions): Promise<ClientRequest[]> {
        let url = 'api/user';
        let conditionIndex: number = 0;
        if (options) {
            if (options.id)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
            if (options.ids)
                url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
            if (options.search !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
            if (!options.clientId)
                url += `${conditionIndex++ === 0 ? '?' : '&'}clientId=${options.clientId}`;
            if (options.status !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}status=${options.status}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<ClientRequest[]>);
    }

    public async create(model: ClientRequest): Promise<ClientRequest> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<ClientRequest>);
    }

    public async update(model: ClientRequest): Promise<ClientRequest> {
        return fetch('api/user', {
            credentials: 'include',
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<ClientRequest>);
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
    public validate(model: ClientRequest): ClientRequestValidation {
        if (!model) return ClientRequestValidation.initial;

        const errors: ClientRequestValidation = {
            isValid: true
        };
        return errors;
    }
}

export const requestService = new RequestService();