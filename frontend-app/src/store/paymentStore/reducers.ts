import { DeleteState, ModelsState, ModelState, PaymentState, ValidatePaymentState } from ".";
import { PaymentValidation } from "../../models";
import { PaymentActions, ActionTypes } from "./actions";

const initialState: PaymentState = {
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: PaymentValidation.initial
}

export function paymentReducer(prevState: PaymentState = initialState, action: PaymentActions): PaymentState {
    switch (action.type) {
        case ActionTypes.getPaymentsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getPaymentsSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.payments };
            return { ...prevState, ...state };
        }
        case ActionTypes.getPaymentsFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.getPaymentRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getPaymentSuccess: {
            const state: ModelState = { modelLoading: false, model: action.payment };
            return { ...prevState, ...state };
        }
        case ActionTypes.getPaymentFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.saveRequest: return prevState;
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.payment };
            const updatedModels = prevState.models.concat(action.payment);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.saveFailure: return prevState;

        case ActionTypes.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false) {
                const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((value) => prevState.ids && !prevState.ids.includes(value.id || '')) };
                const deleteState: DeleteState = { deleting: false, deleted: true };
                return { ...prevState, ...deleteState, ...state };
            }

            return prevState;
        }
        case ActionTypes.deleteFailure: {
            const deleteState: DeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionTypes.validate: {
            const state: ValidatePaymentState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}