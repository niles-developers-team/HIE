import { Action } from "redux";
import { ApplicationError, AppState, AppThunkDispatch, Chat, GetOptions, Message, MessageGetOptions, MessageValidation, SnackbarVariant } from "../../models";
import { AppThunkAction } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";
import { messageService } from "../../services";

//#region Actions types enum
export enum ActionTypes {
    getChatsRequest = 'GET_CHATS_REQUEST',
    getChatsSuccess = 'GET_CHATS_SUCCESS',
    getChatsFailure = 'GET_CHATS_FAILURE',

    getMessagesRequest = 'GET_MESSAGES_REQUEST',
    getMessagesSuccess = 'GET_MESSAGES_SUCCESS',
    getMessagesFailure = 'GET_MESSAGES_FAILURE',

    getMessageRequest = 'GET_MESSAGE_REQUEST',
    getMessageSuccess = 'GET_MESSAGE_SUCCESS',
    getMessageFailure = 'GET_MESSAGE_FAILURE',

    saveRequest = 'SAVE_MESSAGE_REQUEST',
    createSuccess = 'CREATE_MESSAGE_SUCCESS',
    saveFailure = 'SAVE_MESSAGE_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_MESSAGE_REQUEST',
    deleteSuccess = 'DELETE_MESSAGE_SUCCESS',
    deleteFailure = 'DELETE_MESSAGE_FAILURE',

    validate = 'VALIDATE_MESSAGE'
}
//#endregion
//#region Actions types interfaces
export interface GetMessagesRequest extends Action<ActionTypes> {
    type: ActionTypes.getMessagesRequest;
    options: GetOptions;
}
export interface GetMessagesSuccess extends Action<ActionTypes> {
    type: ActionTypes.getMessagesSuccess;
    messages: Message[];
}
export interface GetMessagesFailure extends Action<ActionTypes> {
    type: ActionTypes.getMessagesFailure;
    error: ApplicationError;
}
export interface GetChatsRequest extends Action<ActionTypes> {
    type: ActionTypes.getChatsRequest;
    userId: number;
}
export interface GetChatsSuccess extends Action<ActionTypes> {
    type: ActionTypes.getChatsSuccess;
    chats: Chat[];
}
export interface GetChatsFailure extends Action<ActionTypes> {
    type: ActionTypes.getChatsFailure;
    error: ApplicationError;
}
export interface GetRequest extends Action<ActionTypes> {
    type: ActionTypes.getMessageRequest;
    id?: number;
}
export interface GetSuccess extends Action<ActionTypes> {
    type: ActionTypes.getMessageSuccess;
    message: Message;
}
export interface GetFailure extends Action<ActionTypes> {
    type: ActionTypes.getMessageFailure;
    error: ApplicationError;
}
export interface SaveRequest extends Action<ActionTypes> {
    type: ActionTypes.saveRequest;
    message: Message;
}
export interface CreateSuccess extends Action<ActionTypes> {
    type: ActionTypes.createSuccess;
    message: Message;
}
export interface SaveFailure extends Action<ActionTypes> {
    type: ActionTypes.saveFailure;
    error: ApplicationError;
}
export interface ClearEditionState extends Action<ActionTypes> {
    type: ActionTypes.clearEditionState;
}

export interface DeleteRequest extends Action<ActionTypes> {
    type: ActionTypes.deleteRequest;
    ids: number[];
}

export interface DeleteSuccess extends Action<ActionTypes> {
    type: ActionTypes.deleteSuccess;
}

export interface DeleteFailure extends Action<ActionTypes> {
    type: ActionTypes.deleteFailure;
    error: ApplicationError;
}

export interface Validate extends Action<ActionTypes> {
    type: ActionTypes.validate;
    formErrors: MessageValidation;
}

export type GetChats = GetChatsRequest | GetChatsSuccess | GetChatsFailure;
export type GetMessages = GetMessagesRequest | GetMessagesSuccess | GetMessagesFailure;
export type GetMessage = GetRequest | GetSuccess | GetFailure;
export type SaveMessage = SaveRequest | CreateSuccess | SaveFailure;
export type DeleteMessage = DeleteRequest | DeleteSuccess | DeleteFailure;

export type MessageActions = GetChats
    | GetMessages
    | GetMessage
    | ClearEditionState
    | SaveMessage
    | DeleteMessage
    | Validate;
//#endregion


//#region Actions

function clearEditionState(): ClearEditionState {
    return { type: ActionTypes.clearEditionState };
}

function saveMessage(model: Message): AppThunkAction<Promise<CreateSuccess | SaveFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(model));

        try {
            const { messageState } = getState();
            const result = await messageService.create(model);
            if (messageState.modelsLoading === false)
                messageState.models.push(result);
            return dispatch(createSuccess(result));
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(message: Message): SaveRequest { return { type: ActionTypes.saveRequest, message: message }; }
        function createSuccess(message: Message): CreateSuccess { return { type: ActionTypes.createSuccess, message: message }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionTypes.saveFailure, error: error }; }
    }
}

function getChats(userId: number): AppThunkAction<Promise<GetChatsSuccess | GetChatsFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(userId));

        const { messageState } = getState();

        try {
            if (messageState.chatsLoading === true) {
                const result = await messageService.getChats(userId);
                return dispatch(success(result));
            } else {
                return dispatch(success(messageState.chats));
            }
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.chat, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(userId: number): GetChatsRequest { return { type: ActionTypes.getChatsRequest, userId: userId }; }
        function success(chats: Chat[]): GetChatsSuccess { return { type: ActionTypes.getChatsSuccess, chats: chats }; }
        function failure(error: ApplicationError): GetChatsFailure { return { type: ActionTypes.getChatsFailure, error: error }; }
    }
}

function getMessages(options: MessageGetOptions): AppThunkAction<Promise<GetMessagesSuccess | GetMessagesFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await messageService.get(options);
            return dispatch(success(result));
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: MessageGetOptions): GetMessagesRequest { return { type: ActionTypes.getMessagesRequest, options: options }; }
        function success(messages: Message[]): GetMessagesSuccess { return { type: ActionTypes.getMessagesSuccess, messages: messages }; }
        function failure(error: ApplicationError): GetMessagesFailure { return { type: ActionTypes.getMessagesFailure, error: error }; }
    }
}

function getMessage(id: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch) => {
        dispatch(request(id));

        if (!id)
            return dispatch(success(Message.initial));

        let messages: Message[] = [];

        try {
            let message = messages.find(o => o.id === id);

            if (!message) {
                dispatch(snackbarActions.showSnackbar('Не удалось найти сообщение', SnackbarVariant.warning));
                return dispatch(failure(new ApplicationError('Не удалось найти сообщение')));
            }

            dispatch(validateMessage(message));
            return dispatch(success(message));
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionTypes.getMessageRequest, id: id }; }
        function success(message: Message): GetSuccess { return { type: ActionTypes.getMessageSuccess, message: message }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionTypes.getMessageFailure, error: error }; }
    }
}

function deleteMessages(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await messageService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Сообщения успешно удалены.', SnackbarVariant.info));
            return dispatch(success());
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteRequest { return { type: ActionTypes.deleteRequest, ids: ids }; }
        function success(): DeleteSuccess { return { type: ActionTypes.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteFailure { return { type: ActionTypes.deleteFailure, error: error }; }
    }
}

function validateMessage(message: Message): Validate {
    const result = messageService.validate(message);
    return { type: ActionTypes.validate, formErrors: result };
}

const actions = {
    getChats,
    saveMessage,
    clearEditionState,
    getMessages,
    getMessage,
    deleteMessages,
    validateMessage
}

export default actions;
//#endregion