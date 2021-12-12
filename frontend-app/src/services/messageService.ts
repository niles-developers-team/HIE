import { Chat, Message, MessageGetOptions, MessageValidation } from "../models";
import { handleJsonResponse, handleResponse, ResponseHandler } from "../utilities";

class MessageService {
    public async getChats(userId: number): Promise<Chat[]> {
        let url = `api/ChatMessage/chats?userId=${userId}`;
        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Chat[]>);
    }

    public async get(options?: MessageGetOptions): Promise<Message[]> {
        let url = 'api/ChatMessage/chat';
        let conditionIndex: number = 0;
        if (options) {
            if (options.id)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
            if (options.ids)
                url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
            if (options.search !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
            if (options.senderId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}senderId=${options.senderId}`;
            if (options.recepientId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}recepientId=${options.recepientId}`;
            if (options.requestId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}requestId=${options.requestId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Message[]>);
    }

    public async create(model: Message): Promise<Message> {
        return fetch('api/ChatMessage', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<Message>);
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
    public validate(model: Message): MessageValidation {
        if (!model) return MessageValidation.initial;


        const userErrors: MessageValidation = {
            isValid: true
        };
        return userErrors;
    }
}

export const messageService = new MessageService();