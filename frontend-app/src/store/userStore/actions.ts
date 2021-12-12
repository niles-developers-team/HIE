import { Action } from "redux";

import { User, ApplicationError, AuthenticatedUser, GetOptions, UserAuthenticateOptions, UserValidation, SnackbarVariant, UnauthorizedError, Client, Benefactor } from "../../models";
import { userService, sessionService } from "../../services";
import { AppThunkAction, AppState, AppThunkDispatch } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";

//#region Actions types enum
export enum ActionTypes {
    signinRequest = 'SIGN_IN_REQUEST',
    signinSuccess = 'SIGN_IN_SUCCESS',
    signinFailure = 'SIGN_IN_FAILURE',

    signOut = 'SIGN_OUT',

    getUsersRequest = 'GET_USERS_REQUEST',
    getUsersSuccess = 'GET_USERS_SUCCESS',
    getUsersFailure = 'GET_USERS_FAILURE',

    getUserRequest = 'GET_USER_REQUEST',
    getUserSuccess = 'GET_USER_SUCCESS',
    getUserFailure = 'GET_USER_FAILURE',

    updateClientRequest = 'UPDATE_CLIENT_REQUEST',
    updateClientSuccess = 'UPDATE_CLIENT_SUCCESS',
    updateClientFailure = 'UPDATE_CLIENT_FAILURE',

    updateBenefactorRequest = 'UPDATE_BENEFACTOR_REQUEST',
    updateBenefactorSuccess = 'UPDATE_BENEFACTOR_SUCCESS',
    updateBenefactorFailure = 'UPDATE_BENEFACTOR_FAILURE',

    saveRequest = 'SAVE_USER_REQUEST',
    createSuccess = 'CREATE_USER_SUCCESS',
    updateSuccess = 'UPDATE_USER_SUCCESS',
    saveFailure = 'SAVE_USER_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_USER_REQUEST',
    deleteSuccess = 'DELETE_USER_SUCCESS',
    deleteFailure = 'DELETE_USER_FAILURE',

    validateCredentials = 'VALIDATE_USER_CREDENTIALS',
    validate = 'VALIDATE_USER',

    followUserRequest = 'FOLLOW_USER_REQUEST',
    followUserSuccess = 'FOLLOW_USER_SUCCESS',
    followUserFailure = 'FOLLOW_USER_FAILURE',
}
//#endregion

//#region Actions types interfaces
export interface SigninRequest extends Action<ActionTypes> {
    type: ActionTypes.signinRequest;
    options: UserAuthenticateOptions;
}

export interface SigninSuccess extends Action<ActionTypes> {
    type: ActionTypes.signinSuccess;
    user: AuthenticatedUser;
}

export interface SigninFailure extends Action<ActionTypes> {
    type: ActionTypes.signinFailure;
    error: ApplicationError;
}

export interface Signout extends Action<ActionTypes> {
    type: ActionTypes.signOut;
}

export interface GetUsersRequest extends Action<ActionTypes> {
    type: ActionTypes.getUsersRequest;
    options: GetOptions;
}

export interface GetUsersSuccess extends Action<ActionTypes> {
    type: ActionTypes.getUsersSuccess;
    users: User[];
}

export interface GetUsersFailure extends Action<ActionTypes> {
    type: ActionTypes.getUsersFailure;
    error: ApplicationError;
}

export interface GetRequest extends Action<ActionTypes> {
    type: ActionTypes.getUserRequest;
    id?: number;
}

export interface GetSuccess extends Action<ActionTypes> {
    type: ActionTypes.getUserSuccess;
    user: User;
}

export interface GetFailure extends Action<ActionTypes> {
    type: ActionTypes.getUserFailure;
    error: ApplicationError;
}

export interface UpdateClientRequest extends Action<ActionTypes> {
    type: ActionTypes.updateClientRequest;
    client: Client;
}

export interface UpdateClientSuccess extends Action<ActionTypes> {
    type: ActionTypes.updateClientSuccess;
    client: Client;
}

export interface UpdateClientFailure extends Action<ActionTypes> {
    type: ActionTypes.updateClientFailure;
    error: ApplicationError;
}

export interface UpdateBenefactorRequest extends Action<ActionTypes> {
    type: ActionTypes.updateBenefactorRequest;
    benefactor: Benefactor;
}

export interface UpdateBenefactorSuccess extends Action<ActionTypes> {
    type: ActionTypes.updateBenefactorSuccess;
    benefactor: Benefactor;
}

export interface UpdateBenefactorFailure extends Action<ActionTypes> {
    type: ActionTypes.updateBenefactorFailure;
    error: ApplicationError;
}

export interface SaveRequest extends Action<ActionTypes> {
    type: ActionTypes.saveRequest;
    user: User;
}

export interface CreateSuccess extends Action<ActionTypes> {
    type: ActionTypes.createSuccess;
    user: User;
}

export interface UpdateSuccess extends Action<ActionTypes> {
    type: ActionTypes.updateSuccess;
    user: User;
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

export interface ValidateCredentials extends Action<ActionTypes> {
    type: ActionTypes.validateCredentials;
    formErrors: UserValidation;
}

export interface Validate extends Action<ActionTypes> {
    type: ActionTypes.validate;
    formErrors: UserValidation;
}

export interface FollowUserRequest extends Action<ActionTypes> {
    type: ActionTypes.followUserRequest;
    user: User;
}

export interface FollowUserSuccess extends Action<ActionTypes> {
    type: ActionTypes.followUserSuccess;
    user: User;
}

export interface FollowUserFailure extends Action<ActionTypes> {
    type: ActionTypes.followUserFailure;
    error: ApplicationError;
}

export type Signin = SigninRequest | SigninSuccess | SigninFailure;
export type GetUsers = GetUsersRequest | GetUsersSuccess | GetUsersFailure;
export type GetUser = GetRequest | GetSuccess | GetFailure
export type SaveUser = SaveRequest | CreateSuccess | UpdateSuccess | SaveFailure;
export type UpdateSelectedUser = UpdateBenefactorRequest | UpdateBenefactorSuccess | UpdateBenefactorFailure
    | UpdateClientRequest | UpdateClientSuccess | UpdateClientFailure;
export type DeleteUser = DeleteRequest | DeleteSuccess | DeleteFailure;
export type FollowUser = FollowUserRequest | FollowUserSuccess | FollowUserFailure;

export type UserActions = Signin
    | Signout
    | GetUsers
    | GetUser
    | ClearEditionState
    | SaveUser
    | DeleteUser
    | UpdateSelectedUser
    | ValidateCredentials
    | Validate
    | FollowUser;
//#endregion

//#region Actions
function signin(options: UserAuthenticateOptions): AppThunkAction<Promise<SigninSuccess | SigninFailure>> {
    return async (dispatch) => {
        dispatch(request(options));

        try {
            const result = await userService.signin(options);
            if (result && result.token && sessionService.signIn(result.token)) {
                return dispatch(success(result));
            } else {
                const error: ApplicationError = new ApplicationError('Неправильное имя пользователя или пароль');
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
                return dispatch(failure(error));
            }
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                return dispatch(failure(error));
            return dispatch(failure(error));
        }

        function request(options: UserAuthenticateOptions): SigninRequest { return { type: ActionTypes.signinRequest, options: options }; }
        function success(user: AuthenticatedUser): SigninSuccess { return { type: ActionTypes.signinSuccess, user: user }; }
        function failure(error: ApplicationError): SigninFailure { return { type: ActionTypes.signinFailure, error: error }; }
    }
}

function signout(): Signout {
    userService.signout();
    return { type: ActionTypes.signOut };
}

function saveUser(user: User): AppThunkAction<Promise<CreateSuccess | UpdateSuccess | SaveFailure>> {
    return async (dispatch) => {
        dispatch(request(user));

        try {
            if (user.id) {
                const result = await userService.update(user);
                dispatch(snackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(updateSuccess(result));
            } else {
                const result = await userService.create(user);
                dispatch(snackbarActions.showSnackbar('Пользователь успешно сохранен', SnackbarVariant.success));
                return dispatch(createSuccess(result));
            }
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(user: User): SaveRequest { return { type: ActionTypes.saveRequest, user: user }; }
        function createSuccess(user: User): CreateSuccess { return { type: ActionTypes.createSuccess, user: user }; }
        function updateSuccess(user: User): UpdateSuccess { return { type: ActionTypes.updateSuccess, user: user }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionTypes.saveFailure, error: error }; }
    }
}

function clearEditionState(): ClearEditionState {
    return { type: ActionTypes.clearEditionState };
}

function getUsers(options: GetOptions): AppThunkAction<Promise<GetUsersSuccess | GetUsersFailure>> {
    return async dispatch => {
        dispatch(request(options));

        try {
            const result = await userService.get(options);
            return dispatch(success(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: GetOptions): GetUsersRequest { return { type: ActionTypes.getUsersRequest, options: options }; }
        function success(users: User[]): GetUsersSuccess { return { type: ActionTypes.getUsersSuccess, users: users }; }
        function failure(error: ApplicationError): GetUsersFailure { return { type: ActionTypes.getUsersFailure, error: error }; }
    }
}

function getUser(id?: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(id));

        if (!id)
            return dispatch(success(User.initial));

        const state = getState();
        let users: User[] = [];

        try {
            if (state.userState.modelsLoading === true)
                users = await userService.get({ id });
            else
                users = state.userState.models;

            let user = users.find(o => o.id === id);

            if (!user) {
                throw new ApplicationError('Не удалось найти пользователя');
            }

            dispatch(validateUser(user));
            return dispatch(success(user));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionTypes.getUserRequest, id: id }; }
        function success(user: User): GetSuccess { return { type: ActionTypes.getUserSuccess, user: user }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionTypes.getUserFailure, error: error }; }
    }
}

function updateClientDetails(client: Client): AppThunkAction<Promise<UpdateClientSuccess | UpdateClientFailure>> {
    return async (dispatch) => {
        dispatch(request(client));

        try {
            if (!client.id)
                throw new ApplicationError('Пользователь не найден');

            const result = await userService.updateClient(client);
            dispatch(snackbarActions.showSnackbar('Ваши данные успешно сохранены', SnackbarVariant.success));
            return dispatch(updateSuccess(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(client: Client): UpdateClientRequest { return { type: ActionTypes.updateClientRequest, client: client }; }
        function updateSuccess(client: Client): UpdateClientSuccess { return { type: ActionTypes.updateClientSuccess, client: client }; }
        function failure(error: ApplicationError): UpdateClientFailure { return { type: ActionTypes.updateClientFailure, error: error }; }
    }
}

function updateBenefactorDetails(benefactor: Benefactor): AppThunkAction<Promise<UpdateBenefactorSuccess | UpdateBenefactorFailure>> {
    return async (dispatch) => {
        dispatch(request(benefactor));

        try {
            if (!benefactor.id)
                throw new ApplicationError('Пользователь не найден');

            const result = await userService.updateBenefactor(benefactor);
            dispatch(snackbarActions.showSnackbar('Ваши данные успешно сохранены', SnackbarVariant.success));
            return dispatch(updateSuccess(result));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(benefactor: Benefactor): UpdateBenefactorRequest { return { type: ActionTypes.updateBenefactorRequest, benefactor: benefactor }; }
        function updateSuccess(benefactor: Benefactor): UpdateBenefactorSuccess { return { type: ActionTypes.updateBenefactorSuccess, benefactor: benefactor }; }
        function failure(error: ApplicationError): UpdateBenefactorFailure { return { type: ActionTypes.updateBenefactorFailure, error: error }; }
    }
}

function deleteUsers(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await userService.delete(ids);
            dispatch(snackbarActions.showSnackbar('Пользователь успешно удален.', SnackbarVariant.info));
            return dispatch(success());
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(ids: number[]): DeleteRequest { return { type: ActionTypes.deleteRequest, ids: ids }; }
        function success(): DeleteSuccess { return { type: ActionTypes.deleteSuccess }; }
        function failure(error: ApplicationError): DeleteFailure { return { type: ActionTypes.deleteFailure, error: error }; }
    }
}

function validateCredentials(username: string, password: string): ValidateCredentials {
    const result = userService.validateCredentials(username, password);
    return { type: ActionTypes.validateCredentials, formErrors: result };
}

function validateUser(user: User): Validate {
    const result = userService.validateUser(user);
    return { type: ActionTypes.validate, formErrors: result };
}

function followUser(user: User): AppThunkAction<Promise<FollowUserSuccess | FollowUserFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(user))

        const state = getState();

        try {
            if (state.userState.authenticating === true)
                throw new UnauthorizedError('Вам необходимо авторизоваться');

            let currentUser = state.userState.currentUser;

            if (!state.userState.authenticated)
                throw new UnauthorizedError('Вам необходимо авторизоваться');

            if (!user.id)
                throw new ApplicationError('Пользователь не найден');

            await userService.follow(currentUser?.id || 0, user.id || 0);
            return dispatch(success(user));
        }
        catch (error: any) {
            if (error instanceof ApplicationError)
                dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }
    };

    function request(user: User): FollowUserRequest { return { type: ActionTypes.followUserRequest, user: user }; }
    function success(user: User): FollowUserSuccess { return { type: ActionTypes.followUserSuccess, user: user }; }
    function failure(error: ApplicationError): FollowUserFailure { return { type: ActionTypes.followUserFailure, error: error }; }
}

const actions = {
    signin,
    signout,
    saveUser,
    updateBenefactorDetails,
    updateClientDetails,
    clearEditionState,
    getUsers,
    getUser,
    deleteUsers,
    validateCredentials,
    validateUser,
    followUser
}
export default actions;
//#endregion