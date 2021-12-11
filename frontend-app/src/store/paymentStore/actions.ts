import { Action } from "redux";
import { ApplicationError, GetOptions, Payment, PaymentValidation, SnackbarVariant } from "../../models";
import { AppThunkAction } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";
import { paymentService } from "../../services";

//#region Actions types enum
export enum ActionTypes {
    getPaymentsRequest = 'GET_PAYMENTS_REQUEST',
    getPaymentsSuccess = 'GET_PAYMENTS_SUCCESS',
    getPaymentsFailure = 'GET_PAYMENTS_FAILURE',

    getPaymentRequest = 'GET_PAYMENT_REQUEST',
    getPaymentSuccess = 'GET_PAYMENT_SUCCESS',
    getPaymentFailure = 'GET_PAYMENT_FAILURE',

    saveRequest = 'SAVE_PAYMENT_REQUEST',
    createSuccess = 'CREATE_PAYMENT_SUCCESS',
    saveFailure = 'SAVE_PAYMENT_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_PAYMENT_REQUEST',
    deleteSuccess = 'DELETE_PAYMENT_SUCCESS',
    deleteFailure = 'DELETE_PAYMENT_FAILURE',

    validate = 'VALIDATE_PAYMENT'
}
//#endregion
//#region Actions types interfaces
export interface GetPaymentsRequest extends Action<ActionTypes> {
    type: ActionTypes.getPaymentsRequest;
    options: GetOptions;
}
export interface GetPaymentsSuccess extends Action<ActionTypes> {
    type: ActionTypes.getPaymentsSuccess;
    payments: Payment[];
}
export interface GetPaymentsFailure extends Action<ActionTypes> {
    type: ActionTypes.getPaymentsFailure;
    error: ApplicationError;
}
export interface GetRequest extends Action<ActionTypes> {
    type: ActionTypes.getPaymentRequest;
    id?: string;
}
export interface GetSuccess extends Action<ActionTypes> {
    type: ActionTypes.getPaymentSuccess;
    payment: Payment;
}
export interface GetFailure extends Action<ActionTypes> {
    type: ActionTypes.getPaymentFailure;
    error: ApplicationError;
}
export interface SaveRequest extends Action<ActionTypes> {
    type: ActionTypes.saveRequest;
    payment: Payment;
}
export interface CreateSuccess extends Action<ActionTypes> {
    type: ActionTypes.createSuccess;
    payment: Payment;
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
    ids: string[];
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
    formErrors: PaymentValidation;
}

export type GetPayments = GetPaymentsRequest | GetPaymentsSuccess | GetPaymentsFailure;
export type GetPayment = GetRequest | GetSuccess | GetFailure;
export type SavePayment = SaveRequest | CreateSuccess | SaveFailure;
export type DeletePayment = DeleteRequest | DeleteSuccess | DeleteFailure;

export type PaymentActions = GetPayments
    | GetPayment
    | ClearEditionState
    | SavePayment
    | DeletePayment
    | Validate;
//#endregion


//#region Actions

function clearEditionState(): ClearEditionState {
    return { type: ActionTypes.clearEditionState };
}

function savePayment(model: Payment): AppThunkAction<Promise<CreateSuccess | SaveFailure>> {
    return async (dispatch) => {
        dispatch(request(model));

        try {
            const result = await paymentService.create(model);
            dispatch(snackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
            return dispatch(createSuccess(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(payment: Payment): SaveRequest { return { type: ActionTypes.saveRequest, payment: payment }; }
        function createSuccess(payment: Payment): CreateSuccess { return { type: ActionTypes.createSuccess, payment: payment }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionTypes.saveFailure, error: error }; }
    }
}


function getPayments(options: GetOptions): AppThunkAction<Promise<GetPaymentsSuccess | GetPaymentsFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await paymentService.get(options);
            return dispatch(success(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: GetOptions): GetPaymentsRequest { return { type: ActionTypes.getPaymentsRequest, options: options }; }
        function success(payments: Payment[]): GetPaymentsSuccess { return { type: ActionTypes.getPaymentsSuccess, payments: payments }; }
        function failure(error: ApplicationError): GetPaymentsFailure { return { type: ActionTypes.getPaymentsFailure, error: error }; }
    }
}

function getPayment(id?: string): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch) => {
        dispatch(request(id));

        if (!id)
            return dispatch(success(Payment.initial));

        let payments: Payment[] = [];

        try {
            let payment = payments.find(o => o.id === id);

            if (!payment) {
                dispatch(snackbarActions.showSnackbar('Не удалось найти платеж', SnackbarVariant.warning));
                return dispatch(failure(new ApplicationError('Не удалось найти платеж')));
            }

            dispatch(validatePayment(payment));
            return dispatch(success(payment));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: string): GetRequest { return { type: ActionTypes.getPaymentRequest, id: id }; }
        function success(payment: Payment): GetSuccess { return { type: ActionTypes.getPaymentSuccess, payment: payment }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionTypes.getPaymentFailure, error: error }; }
    }
}

function deletePayments(ids: string[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await paymentService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
            return dispatch(success());
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: string[]): DeleteRequest { return { type: ActionTypes.deleteRequest, ids: ids }; }
        function success(): DeleteSuccess { return { type: ActionTypes.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteFailure { return { type: ActionTypes.deleteFailure, error: error }; }
    }
}

function validatePayment(payment: Payment): Validate {
    const result = paymentService.validate(payment);
    return { type: ActionTypes.validate, formErrors: result };
}

export default {
    savePayment: savePayment,
    clearEditionState,
    getPayments,
    deletePayments,
    validatePayment
}
//#endregion