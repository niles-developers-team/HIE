import moment from "moment";
import { Benefactor, Client, ClientRequest, GetOptions, User, Validation } from ".";

export interface Chat {
    recepientId: number;
    requestId?: number;
    recepientLogin: string;
    lastMessage: Message;
}

export interface Message {
    id?: number;
    text: string;
    createDate: string;

    senderId?: number;
    recepientLogin?: string;
    recepient?: User;
    recepientId?: number;
    requestId?: number;
}

export interface MessageGetOptions extends GetOptions {
    senderId?: number;
    recepientId?: number;
    requestId?: number;
}

export interface MessageValidation extends Validation {

}

export namespace Message {
    export const initial: Message = {
        text: '',        
        createDate: moment().format('yyyy-MM-dd HH:mm'),
    }
}

export namespace MessageValidation {
    export const initial: MessageValidation = {
        isValid: false
    };
}