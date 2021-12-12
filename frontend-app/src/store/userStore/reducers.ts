import { UserState, ModelsState, AuthenticationState, DeleteState, ValidateUserState, ModelState, FollowState } from "./state";
import { UserActions, ActionTypes } from "./actions";
import { SnackbarVariant, UserValidation } from "../../models";
import { SnackbarState } from "../snackbarStore";

const initialState: UserState = {
    authenticating: false,
    modelsLoading: true,
    deleting: false,
    modelLoading: false,
    following: false,

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

        case ActionTypes.saveRequest: {
            return { ...prevState, modelLoading: true };
        }
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
            const updatedModels = prevState.models.map(o => o.id === action.user.id ? action.user : o);

            const modelsState: ModelsState = { modelsLoading: false, models: updatedModels };
            const modelState: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...modelsState, ...modelState };
        }
        case ActionTypes.saveFailure: {
            return { ...prevState, modelLoading: false };
        }
        
        case ActionTypes.updateBenefactorRequest: return prevState;
        case ActionTypes.updateBenefactorSuccess: {
            if (prevState.authenticating === true || !prevState.currentUser) return prevState;

            const benefactor = action.benefactor;
            const user = { ...prevState.currentUser, benefactor };

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state }
        }
        case ActionTypes.updateBenefactorFailure: return prevState;

        case ActionTypes.updateClientRequest: return prevState;
        case ActionTypes.updateClientSuccess: {
            if (prevState.authenticating === true || !prevState.currentUser) return prevState;

            const client = action.client;
            const user = { ...prevState.currentUser, client };

            const state: ModelState = { modelLoading: false, model: user };
            return { ...prevState, ...state }
        }
        case ActionTypes.updateClientFailure: return prevState;

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

        case ActionTypes.followUserRequest: {
            const deleteState: FollowState = { following: true, user: action.user };
            return { ...prevState, ...deleteState };
        }
        case ActionTypes.followUserSuccess: {
            if (prevState.authenticating === true || !prevState.currentUser) return prevState;

            const currentUser = prevState.currentUser;
            currentUser.followsCount++;

            const state: AuthenticationState = { authenticating: false, authenticated: true, currentUser: currentUser };
            const followState: FollowState = { following: false, followed: true };
            return { ...prevState, ...followState, ...state };
        }
        case ActionTypes.followUserFailure: {
            const followState: FollowState = { following: false, followed: false };
            return { ...prevState, ...followState };
        }
        default: return prevState;
    }
}