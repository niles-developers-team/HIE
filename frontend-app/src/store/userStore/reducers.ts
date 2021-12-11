import { UserState, ModelsState, AuthenticationState, DeleteState, ValidateUserState, ModelState } from "./state";
import { UserActions, ActionTypes } from "./actions";
import { UserValidation } from "../../models";

const initialState: UserState = {
    authenticating: false,
    modelsLoading: true,
    deleting: false,
    modelLoading: true,

    formErrors: UserValidation.initial
}

export function userReducer(prevState: UserState = initialState, action: UserActions): UserState {
    switch (action.type) {
        case ActionTypes.signinRequest: {
            const state: AuthenticationState = { authenticating: true, options: action.options };
            return { ...prevState, ...state };
        }
        case ActionTypes.signinSuccess: {
            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: action.user }
            return { ...prevState, ...state };
        }
        case ActionTypes.signinFailure: {
            const state: AuthenticationState = { authenticating: false, authenticated: false }
            return { ...prevState, ...state };
        }

        case ActionTypes.signOut: {
            const state: AuthenticationState = { authenticating: false, authenticated: false, currentUser: undefined }
            return { ...prevState, ...state };
        }

        case ActionTypes.getUserRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserSuccess: {
            const state: ModelState = { modelLoading: false, model: action.user };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUserFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionTypes.getUsersRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.users };
            return { ...prevState, ...state };
        }
        case ActionTypes.getUsersFailure: {
            const state: ModelsState = { modelsLoading: false, models: [] };
            return { ...prevState, ...state };
        }

        case ActionTypes.saveRequest: return prevState;
        case ActionTypes.createSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;
            
            const updatedModel = { ...prevState.model, ...action.user };
            const updatedModels = prevState.models.concat(action.user);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.updateSuccess: {
            if (prevState.modelsLoading === true || prevState.modelLoading === true) return prevState;

            const updatedModel = { ...prevState.model, ...action.user };
            const updatedModels = prevState.models.map(o => o.id == action.user.id ? action.user : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.saveFailure: return prevState;

        case ActionTypes.updateUserDetails: {
            if (prevState.modelLoading === true) {
                return prevState;
            }

            const user = { ...prevState.model, ...action.user };
            const formErrors = { ...prevState.formErrors, ...action.formErrors };

            const state: ModelState = { modelLoading: false, model: user }; 
            const validationState: ValidateUserState = { formErrors: formErrors };
            return { ...prevState, ...state, ...validationState }
        }

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
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.validateCredentials: {
            const state: ValidateUserState = { formErrors: action.formErrors };
            return { ...prevState, ...state };
        }

        case ActionTypes.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }
        default: return prevState;
    }
}