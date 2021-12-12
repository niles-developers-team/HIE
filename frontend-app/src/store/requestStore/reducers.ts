import { DeleteState, ModelsState, ModelState, ClientRequestState, ValidateClientRequestState } from ".";
import { ClientRequestValidation, SnackbarVariant } from "../../models";
import { SnackbarState } from "../snackbarStore";
import { ClientRequestActions, ActionTypes } from "./actions";

const initialState: ClientRequestState = {
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: ClientRequestValidation.initial
}

export function clientRequestReducer(prevState: ClientRequestState = initialState, action: ClientRequestActions): ClientRequestState {
    switch (action.type) {
        case ActionTypes.getRequestsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRequestsSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.requests };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRequestsFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.getRequestRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRequestSuccess: {
            const state: ModelState = { modelLoading: false, model: action.request };
            return { ...prevState, ...state };
        }
        case ActionTypes.getRequestFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.saveRequest: return prevState;
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.request };
            const updatedModels = prevState.models.concat(action.request);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateSuccess: {
            if (prevState.modelLoading === true) {
                return prevState;
            }

            const user = { ...prevState.model, ...action.request };

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state }
        }
        case ActionTypes.saveFailure: return prevState;

        case ActionTypes.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.deleteSuccess: {
            if (prevState.modelsLoading === false) {
                const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((value) => prevState.ids && !prevState.ids.includes(value.id || 0)) };
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
            const state: ValidateClientRequestState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}