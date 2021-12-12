import { Chat, Message, MessageValidation } from "../../models"

export type ChatsLoading = {
    chatsLoading: true;
}

export type ChatsLoaded = {
    chatsLoading: false;
    chats: Chat[];
}

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

export type ChatsState = ChatsLoading | ChatsLoaded;
export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type MessageState = ChatsState & ModelState & ModelsState & DeleteState & ValidateMessageState;