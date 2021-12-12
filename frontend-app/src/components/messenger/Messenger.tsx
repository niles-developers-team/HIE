import { Forum } from "@mui/icons-material";
import { CircularProgress, Container, Grid, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AppState, Chat } from "../../models";
import { messageActions } from "../../store/messageStore";

export function Messenger() {
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
    });

    useEffect(() => {
        setLoading(messageState.chatsLoading);
        if (!messageState.chatsLoading)
            setChats(messageState.chats);
    }, [messageState.chatsLoading]);

    function handleOpenChat(recepientId: number) {
        navigate(`/messenger/${recepientId}`);
    }

    return (
        <Container maxWidth="md">
            <Grid className="h100" container direction="column" component="main" alignItems="center" justifyContent="center">
                {loading && <CircularProgress size={128} />}
                <List>
                    {chats.map((chat, index) => {
                        <ListItem
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
                        </ListItem>
                    })};
                </List>
            </Grid>
        </Container >
    );
}