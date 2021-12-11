import { Message, MessageValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: Message[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: Message;
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

export type ValidateMessageState = {
    formErrors?: MessageValidation;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type MessageState = ModelState & ModelsState & DeleteState & ValidateMessageState;