import { Payment, PaymentValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: Payment[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: Payment;
}

export type ModelsDeleting = {
    deleting: true;
    ids: string[];
}

export type ModelsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: string[];
}

export type ValidatePaymentState = {
    formErrors?: PaymentValidation;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type PaymentState = ModelState & ModelsState & DeleteState & ValidatePaymentState;