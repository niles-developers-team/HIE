import { Comment, CommentValidation } from "../../models"

export type ModelsLoading = {
    modelsLoading: true;
}

export type ModelsLoaded = {
    modelsLoading: false;
    models: Comment[];
}

export type ModelLoading = {
    modelLoading: true;
}

export type ModelLoaded = {
    modelLoading: boolean;
    model?: Comment;
}

export type ModelsDeleting = {
    deleting: true;
    ids: number[];
}

export type ModelsDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type ValidateCommentState = {
    formErrors?: CommentValidation;
}

export type ModelsState = ModelsLoading | ModelsLoaded;
export type ModelState = ModelLoading | ModelLoaded;
export type DeleteState = ModelsDeleting | ModelsDeleted;
export type CommentState = ModelState & ModelsState & DeleteState & ValidateCommentState;