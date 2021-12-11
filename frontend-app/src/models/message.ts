import { Benefactor, Client, ClientRequest } from ".";

export interface Message {
    id?: number;
    text: string;

    client: Client;
    benefactor: Benefactor;
    request?: ClientRequest;
}