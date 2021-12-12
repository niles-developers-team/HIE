import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { UserState } from "../store/userStore";
import { SnackbarState } from "../store/snackbarStore/state";
import { CommentState } from "../store/commentStore";
import { MessageState } from "../store/messageStore";
import { ClientRequestState } from "../store/requestStore";
import { PaymentState } from "../store/paymentStore";

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, AppState, void, Action>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;

export type AppState = {
    commentsState: CommentState;
    messageState: MessageState;
    paymentState: PaymentState;
    requestState: ClientRequestState;
    userState: UserState;
    snackbarState: SnackbarState;
}