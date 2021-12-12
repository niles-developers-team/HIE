import { Container, Grid, CircularProgress, IconButton, List, ListItem, ListItemText, TextField } from "@mui/material";
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

const styles = mergeStyles(bootstrap, colors);
interface Props extends RouteProps, WithStyles<typeof styles> { }

export const ChatComponent = withStyles(styles)(function (props: Props) {
    const {classes} = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const { recepientId, requestId } = useParams();
    const dispatch = useDispatch();
    const { messageState, userState } = useSelector((state: AppState) => ({
        messageState: state.messageState,
        userState: state.userState
    }));

    useEffect(() => {
        setLoading(messageState.modelsLoading)
        if (!messageState.modelsLoading)
            setMessages(messageState.models);
    }, [messageState.modelsLoading])

    useEffect(() => {
        if (userState.authenticating || !userState.currentUser) return;

        dispatch(messageActions.getMessages({
            senderId: userState.currentUser?.id || 0,
            recepientId: recepientId ? parseInt(recepientId) : 0,
            requestId: requestId ? parseInt(requestId) : 0 }));
    });

    function handleMessageSend() {
        if (userState.authenticating || !userState.currentUser) return;

        const newMessage: Message = {
            createdDate: moment().format('yyyy-MM-dd HH:mm'),
            text: message,
            recepientId: recepientId ? parseInt(recepientId) : 0,
            requestId: requestId ? parseInt(requestId) : 0,
            senderId: userState.currentUser?.id || 0
        }

        dispatch(messageActions.saveMessage(newMessage));
    }

    return (
        <Container maxWidth="md">
            <Grid className="h100" container direction="column" component="main" alignItems="center" justifyContent="center">
                {loading && <CircularProgress size={128} />}
                <List>
                    {messages.map((message, index) => {
                        <ListItem>
                            <ListItemText
                                primary={message.text}
                                secondary={`${message.recepient?.login || ''} ${message.createdDate}`}
                            />
                        </ListItem>
                    })};
                </List>
                <Grid item xs />
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
            </Grid>
        </Container>
    );
});