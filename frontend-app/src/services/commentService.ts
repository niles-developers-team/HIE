import { Comment, CommentGetOptions, CommentValidation } from "../models";
import { handleJsonResponse, handleResponse, ResponseHandler } from "../utilities";

class CommentService {
    public async get(options?: CommentGetOptions): Promise<Comment[]> {
        let url = 'api/request/comment';
        let conditionIndex: number = 0;
        if (options) {
            if (options.id)
                url += `${conditionIndex++ === 0 ? '?' : '&'}id=${options.id}`;
            if (options.ids)
                url += `${conditionIndex++ === 0 ? '?' : '&'}ids=${options.ids}`;
            if (options.search !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}search=${options.search}`;
            if (options.userId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}benefactorId=${options.userId}`;
            if (options.requestId !== undefined)
                url += `${conditionIndex++ === 0 ? '?' : '&'}requestId=${options.requestId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<Comment[]>);
    }

    public async create(model: Comment): Promise<Comment> {
        return fetch('api/request/comment', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        })
            .then(handleJsonResponse as ResponseHandler<Comment>);
    }

    public async delete(ids: number[]): Promise<void> {
        return fetch('api/request/comment', {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        })
            .then(handleResponse);
    }
    public validate(model: Comment): CommentValidation {
        if (!model) return CommentValidation.initial;


        const userErrors: CommentValidation = {
            isValid: true
        };
        return userErrors;
    }
}

export const commentService = new CommentService();