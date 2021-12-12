import { CircularProgress, Container, Grid, IconButton, InputAdornment, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupAdd, Search } from "@mui/icons-material";
import { AppState, User } from "../../models";
import { userActions } from "../../store/userStore";

import { useDebounce } from '../../hooks';
import { WithStyles, withStyles } from "@mui/styles";
import { bootstrap, colors } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";

const styles = mergeStyles(bootstrap, colors);

interface Props extends WithStyles<typeof styles> { }

export const SearchComponent = withStyles(styles)(function (props: Props) {
    const { classes } = props;

    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const [users, setUsers] = useState<User[]>([]);
    const { userState } = useSelector((state: AppState) => ({
        userState: state.userState,
    }));

    const debouncedSearch = useDebounce(search || '', 500);

    useEffect(() => { dispatch(userActions.getUsers()) }, []);
    useEffect(() => { dispatch(userActions.getUsers({ search: debouncedSearch })); }, [debouncedSearch]);
    useEffect(() => {
        setLoading(userState.modelsLoading);
        if (userState.modelsLoading === false) {
            setUsers(userState.models);
        }
    }, [userState.modelsLoading])

    const dispatch = useDispatch();

    function handleFollow(user: User) {
        dispatch(userActions.followUser(user))
    }

    return (
        <Container maxWidth="md">
            <Grid className={classes.h100} container direction="column" component="main" alignItems="center" justifyContent="start">
                <Grid className={classes.p1} container direction="row" alignItems="center" justifyContent="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search className={classes.secondaryColor} fontSize="large" /></InputAdornment>,
                            endAdornment: <InputAdornment position="end">{loading && <CircularProgress />}</InputAdornment>
                        }}
                        value={search} onChange={(event) => setSearch(event && event.target?.value || '')} />

                    <input className={classes.borderlessInput} />
                </Grid>
                {!loading && users.map((user, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <GroupAdd onClick={() => { handleFollow(user); }} />
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={user.login}
                            secondary={user.email || ''}
                        />
                    </ListItem>
                ))}
            </Grid>
        </Container>
    );
});