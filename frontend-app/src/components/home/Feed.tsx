import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActions, CardContent, CircularProgress, Grid, IconButton, List, TextField, Typography } from "@mui/material";
import { Payments, Comment as CommentIcon, Send } from "@mui/icons-material"
import { Feed, Comment, ClientRequest } from "../../models";

import clsx from "clsx";
import { WithStyles, withStyles } from "@mui/styles";
import { bootstrap } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";
import { colors } from "../../theme/colors";
import { ChangeEvent, useState } from "react";

const styles = mergeStyles(bootstrap, colors);

interface Props extends WithStyles<typeof styles> {
    className: string | undefined;
    feed: Feed;
    comments: Comment[];
    isCommentsOpened: boolean;
    commentsLoading: boolean;
    onPayment: (feed: Feed) => void;
    onCommentsToggle: (feed: Feed) => void;
    onCommentSend: (text: string, request?: ClientRequest, parent?: Comment) => void
}

export const FeedComponent = withStyles(styles)(function (props: Props): JSX.Element {
    const { feed, className, classes, isCommentsOpened, comments, commentsLoading, onCommentsToggle: onCommentsOpen, onPayment, onCommentSend } = props;

    const [comment, setComment] = useState<string>();
    
    function handleCommentChange(event: ChangeEvent<HTMLInputElement>) {
        setComment(event && event.target && event.target.value || '')
    }
    return (
        <Accordion className={className}>
            <AccordionSummary>
                <Grid container direction="column">
                    <Grid container direction="row">
                        <Typography variant="body2">{feed.user.login}</Typography>
                        <Grid xs />
                        <Typography className={classes.secondaryColor} variant="caption">Закроется: {feed.request?.deadlineDate}</Typography>
                    </Grid>
                    <Typography className={classes.mt1} variant="body1">{feed.request?.description}</Typography>
                    <Grid className={classes.mt1} container direction="row" alignItems="center">
                        <Payments className={classes.secondaryColor} />
                        <Typography className={clsx(classes.ml1, classes.secondaryColor)}>{feed.paymentsCount}</Typography>
                        <Typography variant="caption" className={clsx(classes.ml1, classes.secondaryColor)}>({feed.request?.amount} &#8381; из {feed.request?.totalAmount} &#8381;)</Typography>
                        <Grid xs />
                        <Button onClick={() => onPayment(feed)}>Сделать пожертвование</Button>
                        <Grid xs={1}>
                            {
                                commentsLoading && isCommentsOpened ?
                                    (<CircularProgress size={24} />)
                                    :
                                    (<IconButton size="small" onClick={() => onCommentsOpen(feed)} color={isCommentsOpened && 'primary' || undefined}><CommentIcon /></IconButton>)
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {comments.map((comment, index) => (
                        <Typography>{comment.text}</Typography>
                    ))}
                </List>
                <Grid className={classes.px1} container direction="row" alignItems="center">
                    <Grid item xs>
                        <TextField
                            multiline
                            maxRows={4}
                            fullWidth
                            placeholder="Введите комментарий"
                            variant="standard"
                            value={comment}
                            onChange={handleCommentChange} />
                    </Grid>
                    <IconButton disabled={!comment} onClick={() => onCommentSend(comment || '', feed.request, undefined)}><Send /></IconButton>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
});