import { Forum } from "@mui/icons-material";
import { Card, CircularProgress, Container, Grid, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppState, Chat } from "../../models";
import { messageActions } from "../../store/messageStore";

import clsx from "clsx";
import { WithStyles, withStyles } from "@mui/styles";
import { bootstrap, colors } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";

const styles = mergeStyles(bootstrap, colors);
interface Props extends WithStyles<typeof styles> { }

export const Messenger = withStyles(styles)(function (props: Props) {
    const { classes } = props;
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { messageState, userState } = useSelector((state: AppState) => ({
        messageState: state.messageState,
        userState: state.userState
    }));

    useEffect(() => {
        if (userState.authenticating || !userState.currentUser) return;

        dispatch(messageActions.getChats(userState.currentUser?.id || 0));
    }, [messageState.modelsLoading]);

    useEffect(() => {
        setLoading(messageState.chatsLoading);
        if (!messageState.chatsLoading)
            setChats(messageState.chats);
    }, [messageState.chatsLoading]);

    function handleOpenChat(recepientId: number) {
        navigate(`/messenger/${recepientId}`);
    }

    return (
        <Container className={classes.h100} maxWidth="md">
            <Grid className={classes.h100} container direction="column" component="main" alignItems="center" justifyContent="start">
                {loading && <CircularProgress size={128} />}
                {!chats.length &&
                    <>
                        <Grid item xs /><Typography className={classes.secondaryColor} variant="h5">Похоже сообщений еще нет</Typography><Grid item xs />
                    </>
                }
                {chats.length > 0 && (<Card className={clsx(classes.w100, classes.mt3)}>
                    <List>
                        {chats.map((chat, index) => {
                            return (<ListItem
                                secondaryAction={
                                    <Grid>
                                        <IconButton edge="end" aria-label="delete" onClick={() => { handleOpenChat(chat.recepientId); }}>
                                            <Forum />
                                        </IconButton>
                                    </Grid>
                                }>
                                <ListItemText
                                    primary={chat.recepientLogin}
                                    secondary={chat.lastMessage?.text || ''}
                                />
                            </ListItem>);
                        })}
                    </List>
                </Card>
                )}
            </Grid>
        </Container >
    );
});