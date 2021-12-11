import moment from "moment";
import { Client, GetOptions, Validation } from ".";

export interface ClientRequest
{
    id?: number;
    deadlineDate: string;
    description: string;
    totalAmount: number;
    amount: number;
    
    priority: RequestPriorities;
    status: RequestStatuses;

    client?: Client;
}

export enum RequestPriorities
{
    Low, Medium, High, Highest
}

export enum RequestStatuses 
{
    InProgress, Completed, Error
}

export namespace ClientRequest {
    export const initial: ClientRequest = {
        amount: 0,
        deadlineDate: moment().format('yyyy-MM-dd'),
        description: '',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 0
    }
}

export interface ClientRequestGetOptions extends GetOptions {
    clientId?: string;
    status?: string;
}
export interface ClientRequestValidation extends Validation {
    clientError?: string;
}
export namespace ClientRequestValidation {
    export const initial: ClientRequestValidation = Validation.initial;
}
