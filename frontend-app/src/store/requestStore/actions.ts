import { Action } from "redux";
import { ApplicationError, GetOptions, ClientRequest, ClientRequestValidation, SnackbarVariant } from "../../models";
import { AppThunkAction } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";
import { requestService } from "../../services";

//#region Actions types enum
export enum ActionTypes {
    getRequestsRequest = 'GET_REQUESTS_REQUEST',
    getRequestsSuccess = 'GET_REQUESTS_SUCCESS',
    getRequestsFailure = 'GET_REQUESTS_FAILURE',

    getRequestRequest = 'GET_REQUEST_REQUEST',
    getRequestSuccess = 'GET_REQUEST_SUCCESS',
    getRequestFailure = 'GET_REQUEST_FAILURE',

    saveRequest = 'SAVE_REQUEST_REQUEST',
    createSuccess = 'CREATE_REQUEST_SUCCESS',
    updateSuccess = 'UPDATE_REQUEST_SUCCESS',
    saveFailure = 'SAVE_REQUEST_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_REQUEST_REQUEST',
    deleteSuccess = 'DELETE_REQUEST_SUCCESS',
    deleteFailure = 'DELETE_REQUEST_FAILURE',

    validate = 'VALIDATE_REQUEST'
}
//#endregion
//#region Actions types interfaces
export interface GetClientRequestsRequest extends Action<ActionTypes> {
    type: ActionTypes.getRequestsRequest;
    options: GetOptions;
}
export interface GetClientRequestsSuccess extends Action<ActionTypes> {
    type: ActionTypes.getRequestsSuccess;
    requests: ClientRequest[];
}
export interface GetClientRequestsFailure extends Action<ActionTypes> {
    type: ActionTypes.getRequestsFailure;
    error: ApplicationError;
}
export interface GetClientRequestRequest extends Action<ActionTypes> {
    type: ActionTypes.getRequestRequest;
    id?: number;
}
export interface GetClientRequestSuccess extends Action<ActionTypes> {
    type: ActionTypes.getRequestSuccess;
    request: ClientRequest;
}
export interface GetClientRequestFailure extends Action<ActionTypes> {
    type: ActionTypes.getRequestFailure;
    error: ApplicationError;
}
export interface SaveClientRequestRequest extends Action<ActionTypes> {
    type: ActionTypes.saveRequest;
    request: ClientRequest;
}
export interface CreateClientRequestSuccess extends Action<ActionTypes> {
    type: ActionTypes.createSuccess;
    request: ClientRequest;
}
export interface UpdateClientRequestSuccess extends Action<ActionTypes> {
    type: ActionTypes.updateSuccess;
    request: ClientRequest;
}
export interface SaveClientRequestFailure extends Action<ActionTypes> {
    type: ActionTypes.saveFailure;
    error: ApplicationError;
}
export interface ClearEditionState extends Action<ActionTypes> {
    type: ActionTypes.clearEditionState;
}

export interface DeleteClientRequestRequest extends Action<ActionTypes> {
    type: ActionTypes.deleteRequest;
    ids: number[];
}

export interface DeleteClientRequestSuccess extends Action<ActionTypes> {
    type: ActionTypes.deleteSuccess;
}

export interface DeleteClientRequestFailure extends Action<ActionTypes> {
    type: ActionTypes.deleteFailure;
    error: ApplicationError;
}

export interface Validate extends Action<ActionTypes> {
    type: ActionTypes.validate;
    formErrors: ClientRequestValidation;
}

export type GetRequests = GetClientRequestsRequest | GetClientRequestsSuccess | GetClientRequestsFailure;
export type GetRequest = GetClientRequestRequest | GetClientRequestSuccess | GetClientRequestFailure;
export type SaveRequest = SaveClientRequestRequest | CreateClientRequestSuccess | UpdateClientRequestSuccess | SaveClientRequestFailure;
export type DeleteRequest = DeleteClientRequestRequest | DeleteClientRequestSuccess | DeleteClientRequestFailure;

export type ClientRequestActions = GetRequests
    | GetRequest
    | ClearEditionState
    | SaveRequest
    | DeleteRequest
    | Validate;
//#endregion


//#region Actions

function clearEditionState(): ClearEditionState {
    return { type: ActionTypes.clearEditionState };
}

function saveRequest(model: ClientRequest): AppThunkAction<Promise<CreateClientRequestSuccess | UpdateClientRequestSuccess | SaveClientRequestFailure>> {
    return async (dispatch) => {
        dispatch(request(model));

        try {
            if(!model.id) {
            const result = await requestService.create(model);
            dispatch(snackbarActions.showSnackbar('Запрос успешно создан', SnackbarVariant.success));
            return dispatch(createSuccess(result));
            }
            else {
                const result = await requestService.update(model);
                dispatch(snackbarActions.showSnackbar('Запрос успешно обновлен', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            }
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(request: ClientRequest): SaveClientRequestRequest { return { type: ActionTypes.saveRequest, request: request }; }
        function createSuccess(request: ClientRequest): CreateClientRequestSuccess { return { type: ActionTypes.createSuccess, request: request }; }
        function updateSuccess(request: ClientRequest): UpdateClientRequestSuccess { return { type: ActionTypes.updateSuccess, request: request }; }
        function failure(error: ApplicationError): SaveClientRequestFailure { return { type: ActionTypes.saveFailure, error: error }; }
    }
}


function getRequests(options: GetOptions): AppThunkAction<Promise<GetClientRequestsSuccess | GetClientRequestsFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await requestService.get(options);
            return dispatch(success(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: GetOptions): GetClientRequestsRequest { return { type: ActionTypes.getRequestsRequest, options: options }; }
        function success(requests: ClientRequest[]): GetClientRequestsSuccess { return { type: ActionTypes.getRequestsSuccess, requests: requests }; }
        function failure(error: ApplicationError): GetClientRequestsFailure { return { type: ActionTypes.getRequestsFailure, error: error }; }
    }
}

function getRequest(id: number): AppThunkAction<Promise<GetClientRequestSuccess | GetClientRequestFailure>> {
    return async (dispatch) => {
        dispatch(request(id));

        if (!id)
            return dispatch(success(ClientRequest.initial));

        let requests: ClientRequest[] = [];

        try {
            let request = requests.find(o => o.id === id);

            if (!request) 
                throw new ApplicationError('Не удалось найти запрос');

            dispatch(validateRequest(request));
            return dispatch(success(request));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetClientRequestRequest { return { type: ActionTypes.getRequestRequest, id: id }; }
        function success(request: ClientRequest): GetClientRequestSuccess { return { type: ActionTypes.getRequestSuccess, request: request }; }
        function failure(error: ApplicationError): GetClientRequestFailure { return { type: ActionTypes.getRequestFailure, error: error }; }
    }
}

function deleteRequests(ids: number[]): AppThunkAction<Promise<DeleteClientRequestSuccess | DeleteClientRequestFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await requestService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Запрос успешно удален.', SnackbarVariant.info));
            return dispatch(success());
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteClientRequestRequest { return { type: ActionTypes.deleteRequest, ids: ids }; }
        function success(): DeleteClientRequestSuccess { return { type: ActionTypes.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteClientRequestFailure { return { type: ActionTypes.deleteFailure, error: error }; }
    }
}

function validateRequest(request: ClientRequest): Validate {
    const result = requestService.validate(request);
    return { type: ActionTypes.validate, formErrors: result };
}

export default {
    saveRequest,
    clearEditionState,
    getRequests,
    getRequest,
    deleteRequests,
    validateRequest
}
//#endregion