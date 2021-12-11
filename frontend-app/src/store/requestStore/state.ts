import { ClientRequest, ClientRequestValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: ClientRequest[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: ClientRequest;
}

export type ModelsDeleting = {
    deleting: true;
    ids: number[];
}

export type ModelsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type ValidateClientRequestState = {
    formErrors?: ClientRequestValidation;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type ClientRequestState = ModelState & ModelsState & DeleteState & ValidateClientRequestState;