import { Container, Grid, CircularProgress, IconButton, List, ListItem, ListItemText, TextField, Paper, Typography, Card } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteProps, useParams } from "react-router-dom";
import { Message, AppState } from "../../models";
import { messageActions } from "../../store/messageStore";
import { Send } from "@mui/icons-material";
import moment from "moment";
import { WithStyles, withStyles } from "@mui/styles";
import { bootstrap, colors } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";

import clsx from "clsx";

const styles = mergeStyles(bootstrap, colors);
interface Props extends WithStyles<typeof styles> { }

export const ChatComponent = withStyles(styles)(function (props: Props) {
    const { classes } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    let messages: Message[] = [];

    const { recepientId, requestId } = useParams();
    const dispatch = useDispatch();
    const { messageState, userState } = useSelector((state: AppState) => ({
        messageState: state.messageState,
        userState: state.userState
    }));

    useEffect(() => {
        setLoading(messageState.modelsLoading)
    }, [messageState.modelsLoading])

    useEffect(() => {
        if (userState.authenticating || !userState.currentUser) return;

        dispatch(messageActions.getMessages({
            senderId: userState.currentUser?.id || 0,
            recepientId: recepientId ? parseInt(recepientId) : 0,
            requestId: requestId ? parseInt(requestId) : 0
        }));
    }, [recepientId]);

    function handleMessageSend() {
        if (userState.authenticating || !userState.currentUser) return;

        const newMessage: Message = {
            createDate: moment().format('yyyy-MM-dd HH:mm'),
            text: message,
            recepientId: recepientId ? parseInt(recepientId) : 0,
            requestId: requestId ? parseInt(requestId) : 0,
            senderId: userState.currentUser?.id || 0
        }

        dispatch(messageActions.saveMessage(newMessage));
    }

    if (!messageState.modelsLoading) {
        messages = messageState.models;
    }

    const messagesComponents = messages.map((message, index) => {
        return (<ListItem>
            <ListItemText
                primary={message.text}
                secondary={`${message.recepientLogin || ''} ${message.createDate}`}
            />
        </ListItem>);
    });

    return (
        <Container className={classes.h100} maxWidth="md">
            <Grid className={classes.h100} container direction="column" component="main" alignItems="center" justifyContent="center">
                {loading && <CircularProgress size={128} />}
                {!messages.length && (
                    <>
                        <Grid item xs /><Typography className={classes.secondaryColor} variant="h5">Похоже сообщений еще нет</Typography>
                    </>
                )}
                <Card className={clsx(classes.w100, classes.mt3)}>
                    <List>
                        {messagesComponents}
                    </List>
                </Card>
                <Grid item xs />
                <Paper className={clsx(classes.w100, classes.p1)}>
                    <Grid className={classes.px1} container direction="row" alignItems="center">
                        <Grid item xs>
                            <TextField
                                multiline
                                maxRows={4}
                                fullWidth
                                placeholder="Введите комментарий"
                                variant="standard"
                                value={message}
                                onChange={(event) => setMessage(event && event.target && event.target.value || '')} />
                        </Grid>
                        <IconButton disabled={!message} onClick={() => handleMessageSend()}><Send /></IconButton>
                    </Grid>
                </Paper>
            </Grid>
        </Container>
    );
});