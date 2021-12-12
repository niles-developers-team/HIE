import moment from "moment";
import { User, ClientRequest, GetOptions, Validation } from ".";

export interface Comment {
    id?: number;
    createdDate?: string;
    text: string;

    parent?: Comment;
    request?: ClientRequest;
    user?: User;
}

export interface CommentGetOptions extends GetOptions {
    userId?: number;
    requestId?: number;
}

export interface CommentValidation extends Validation {

}

export namespace Comment {
    export const initial: Comment = {
        createdDate: moment().format('yyyy-MM-dd HH:mm'),
        text: '',
    }
}

export namespace CommentValidation {
    export const initial: CommentValidation = {
        isValid: false
    };
}