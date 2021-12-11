import moment from "moment";
import { Benefactor, Client, ClientRequest, GetOptions, Validation } from ".";

export interface Message {
    id?: number;
    text: string;
    createdDate: string;

    client?: Client;
    benefactor?: Benefactor;
    request?: ClientRequest;
}

export interface MessageGetOptions extends GetOptions {
    clientId?: number;
    benefactorId?: number;
    requestId?: number;
}

export interface MessageValidation extends Validation {

}

export namespace Message {
    export const initial: Message = {
        text: '',        
        createdDate: moment().format('yyyy-MM-dd HH:mm'),
    }
}

export namespace MessageValidation {
    export const initial: MessageValidation = {
        isValid: false
    };
}