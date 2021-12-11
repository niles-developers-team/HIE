import { User, ClientRequest } from ".";

export interface Comment {
    id?: number;
    createdDate: string;
    text: string;

    parent?: Comment;
    request: ClientRequest;
    user: User;
}