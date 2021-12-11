import { Payment } from "./payment";

export interface Benefactor
{
    id?: number;
    level: number;
    alwaysCommisionToService: boolean;

    payments: Payment[];
}