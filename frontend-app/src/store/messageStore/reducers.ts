import { DeleteState, ModelsState, ModelState, MessageState, ValidateMessageState } from ".";
import { MessageValidation } from "../../models";
import { MessageActions, ActionTypes } from "./actions";

const initialState: MessageState = {
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: MessageValidation.initial
}

export function messageReducer(prevState: MessageState = initialState, action: MessageActions): MessageState {
    switch (action.type) {
        case ActionTypes.getMessagesRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getMessagesSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.messages };
            return { ...prevState, ...state };
        }
        case ActionTypes.getMessagesFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.getMessageRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getMessageSuccess: {
            const state: ModelState = { modelLoading: false, model: action.message };
            return { ...prevState, ...state };
        }
        case ActionTypes.getMessageFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.saveRequest: return prevState;
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.message };
            const updatedModels = prevState.models.concat(action.message);

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
            const state: ValidateMessageState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}