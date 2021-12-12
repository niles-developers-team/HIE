import { Action } from "redux";
import { ApplicationError, GetOptions, Comment, CommentValidation, SnackbarVariant, CommentGetOptions, AppState, AppThunkDispatch } from "../../models";
import { AppThunkAction } from "../../models/reduxModels";
import { snackbarActions } from "../snackbarStore";
import { commentService } from "../../services";

//#region Actions types enum
export enum ActionTypes {
    getCommentsRequest = 'GET_COMMENTS_REQUEST',
    getCommentsSuccess = 'GET_COMMENTS_SUCCESS',
    getCommentsFailure = 'GET_COMMENTS_FAILURE',

    getCommentRequest = 'GET_COMMENT_REQUEST',
    getCommentSuccess = 'GET_COMMENT_SUCCESS',
    getCommentFailure = 'GET_COMMENT_FAILURE',

    saveRequest = 'SAVE_COMMENT_REQUEST',
    createSuccess = 'CREATE_COMMENT_SUCCESS',
    saveFailure = 'SAVE_COMMENT_FAILURE',

    clearEditionState = 'CLEAR_EDITION_STATE',

    deleteRequest = 'DELETE_COMMENT_REQUEST',
    deleteSuccess = 'DELETE_COMMENT_SUCCESS',
    deleteFailure = 'DELETE_COMMENT_FAILURE',

    validate = 'VALIDATE_COMMENT'
}
//#endregion
//#region Actions types interfaces
export interface GetCommentsRequest extends Action<ActionTypes> {
    type: ActionTypes.getCommentsRequest;
    options: GetOptions;
}
export interface GetCommentsSuccess extends Action<ActionTypes> {
    type: ActionTypes.getCommentsSuccess;
    comments: Comment[];
}
export interface GetCommentsFailure extends Action<ActionTypes> {
    type: ActionTypes.getCommentsFailure;
    error: ApplicationError;
}
export interface GetRequest extends Action<ActionTypes> {
    type: ActionTypes.getCommentRequest;
    id?: number;
}
export interface GetSuccess extends Action<ActionTypes> {
    type: ActionTypes.getCommentSuccess;
    comment: Comment;
}
export interface GetFailure extends Action<ActionTypes> {
    type: ActionTypes.getCommentFailure;
    error: ApplicationError;
}
export interface SaveRequest extends Action<ActionTypes> {
    type: ActionTypes.saveRequest;
    comment: Comment;
}
export interface CreateSuccess extends Action<ActionTypes> {
    type: ActionTypes.createSuccess;
    comment: Comment;
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
    formErrors: CommentValidation;
}

export type GetComments = GetCommentsRequest | GetCommentsSuccess | GetCommentsFailure;
export type GetComment = GetRequest | GetSuccess | GetFailure;
export type SaveComment = SaveRequest | CreateSuccess | SaveFailure;
export type DeleteComment = DeleteRequest | DeleteSuccess | DeleteFailure;

export type CommentActions = GetComments
    | GetComment
    | ClearEditionState
    | SaveComment
    | DeleteComment
    | Validate;
//#endregion


//#region Actions

function clearEditionState(): ClearEditionState {
    return { type: ActionTypes.clearEditionState };
}

function saveComment(model: Comment): AppThunkAction<Promise<CreateSuccess | SaveFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(model));

        try {
            const {commentsState} = getState();
            const result = await commentService.create(model);
            if (commentsState.modelsLoading === false)
                commentsState.models.push(result);

            return dispatch(createSuccess(result));
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(comment: Comment): SaveRequest { return { type: ActionTypes.saveRequest, comment: comment }; }
        function createSuccess(comment: Comment): CreateSuccess { return { type: ActionTypes.createSuccess, comment: comment }; }
        function failure(error: ApplicationError): SaveFailure { return { type: ActionTypes.saveFailure, error: error }; }
    }
}


function getComments(options: CommentGetOptions): AppThunkAction<Promise<GetCommentsSuccess | GetCommentsFailure>> {
    return async (dispatch: AppThunkDispatch, getState: () => AppState) => {
        dispatch(request(options));
        const { commentsState } = getState();
        let result: Comment[] = [];
        if (commentsState.modelsLoading === false) {
            result = commentsState.models.filter(o => o.request?.id === options.requestId);
        }

        try {
            if(!result.length) {
                result = await commentService.get(options);
                return dispatch(success(result));
            } else {
                return dispatch(success(result));
            }
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(options: CommentGetOptions): GetCommentsRequest { return { type: ActionTypes.getCommentsRequest, options: options }; }
        function success(comments: Comment[]): GetCommentsSuccess { return { type: ActionTypes.getCommentsSuccess, comments: comments }; }
        function failure(error: ApplicationError): GetCommentsFailure { return { type: ActionTypes.getCommentsFailure, error: error }; }
    }
}

function getComment(id: number): AppThunkAction<Promise<GetSuccess | GetFailure>> {
    return async (dispatch) => {
        dispatch(request(id));

        if (!id)
            return dispatch(success(Comment.initial));

        let comments: Comment[] = [];

        try {
            let comment = comments.find(o => o.id === id);

            if (!comment) {
                dispatch(snackbarActions.showSnackbar('Не удалось найти сообщение', SnackbarVariant.warning));
                return dispatch(failure(new ApplicationError('Не удалось найти сообщение')));
            }

            dispatch(validateComment(comment));
            return dispatch(success(comment));
        }
        catch (error: any) {

            dispatch(snackbarActions.showSnackbar(error.message, SnackbarVariant.error));
            return dispatch(failure(error));
        }

        function request(id?: number): GetRequest { return { type: ActionTypes.getCommentRequest, id: id }; }
        function success(comment: Comment): GetSuccess { return { type: ActionTypes.getCommentSuccess, comment: comment }; }
        function failure(error: ApplicationError): GetFailure { return { type: ActionTypes.getCommentFailure, error: error }; }
    }
}

function deleteComments(ids: number[]): AppThunkAction<Promise<DeleteSuccess | DeleteFailure>> {
    return async (dispatch) => {
        dispatch(request(ids));

        try {
            await commentService.delete(ids);
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

function validateComment(comment: Comment): Validate {
    const result = commentService.validate(comment);
    return { type: ActionTypes.validate, formErrors: result };
}

const actions = {
    saveComment,
    clearEditionState,
    getComments,
    getComment,
    deleteComments,
    validateComment
}

export default actions;
//#endregion