import { DeleteState, ModelsState, ModelState, CommentState, ValidateCommentState } from ".";
import { CommentValidation } from "../../models";
import { CommentActions, ActionTypes } from "./actions";

const initialState: CommentState = {
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: CommentValidation.initial
}

export function commentReducer(prevState: CommentState = initialState, action: CommentActions): CommentState {
    switch (action.type) {
        case ActionTypes.getCommentsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getCommentsSuccess: {
            let models = action.comments;
            if (prevState.modelsLoading === false) {
                models = [...prevState.models, ...models];
            }

            const state: ModelsState = { modelsLoading: false, models: models };
            return { ...prevState, ...state };
        }
        case ActionTypes.getCommentsFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.getCommentRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getCommentSuccess: {
            const state: ModelState = { modelLoading: false, model: action.comment };
            return { ...prevState, ...state };
        }
        case ActionTypes.getCommentFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.saveRequest: return prevState;
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.comment };
            const updatedModels = prevState.models.concat(action.comment);

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
            const state: ValidateCommentState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}