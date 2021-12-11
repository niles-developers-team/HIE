import { Client } from ".";

export interface ClientRequest
{
    id?: number;
    deadlineDate: string;
    description: string;
    totalAmount: number;
    amount: number;
    
    clientPriority: RequestPriorities;
    systemPriority: RequestPriorities;
    status: RequestStatuses;

    client: Client;
}

export enum RequestPriorities
{
    Low, Medium, High, Highest
}

export enum RequestStatuses 
{
    InProgress, Completed, Error
}