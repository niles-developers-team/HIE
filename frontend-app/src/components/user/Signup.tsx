import { Alert, Button, Card, CardContent, CardHeader, CircularProgress, Grid, IconButton, Link, Snackbar, TextField, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState, SnackbarVariant, UserValidation } from "../../models";
import { snackbarActions } from "../../store/snackbarStore";
import { userActions } from "../../store/userStore";
import { bootstrap } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";
import { Close } from "@mui/icons-material";

import clsx from "clsx";
const styles = mergeStyles(bootstrap);

interface Props extends WithStyles<typeof styles> { }

export const Signup = withStyles(styles)(function (props: Props) {
    const { classes } = props;

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { userState, snackbarState } = useSelector((state: AppState) => ({
        userState: state.userState,
        snackbarState: state.snackbarState
    }));

    const [variant, setVariant] = useState<SnackbarVariant>(SnackbarVariant.info);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [login, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [formErrors, setFormErrors] = useState<UserValidation>({ isValid: false });

    const [clientOrBenefactor, setClientOrBenefactor] = useState<boolean>(false);

    const [inn, setINN] = useState<string>('');
    const [kpp, setKPP] = useState<string>('');
    const [ogrn, setOgrn] = useState<string>('');
    const [personalBankAccountn, setPersonalBankAccount] = useState<string>('');

    useEffect(() => {
        if (snackbarState.show !== true) {
            setOpen(false);
            return;
        }

        setVariant(snackbarState.variant);
        setMessage(snackbarState.message);
        setOpen(true);
    }, [snackbarState]);
    useEffect(() => { setFormErrors(userState?.formErrors || UserValidation.initial); }, [userState.formErrors]);
    useEffect(() => { dispatch(userActions.validateCredentials(login, password)); }, [login, password]);
    useEffect(() => {
        if (userState.authenticating) return;
        if (userState.authenticated) {
            navigate('/');
        } else {
            setPassword('');
        }
    }, [userState.authenticating, navigate]);
    useEffect(() => {

    })
    useEffect(() => {
        setLoading(userState.modelLoading);
    }, [userState.modelLoading]);

    function handleSnackbarClose() { dispatch(snackbarActions.hideSnackbar()); }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        setLoading(true);
        event.preventDefault();
        dispatch(userActions.saveUser({ login, password, phone: phone, email, followersCount: 0, followsCount: 0 }));

        navigate('/sign-in');
    }

    function handleUserNameChange(event: ChangeEvent<HTMLInputElement>) { setUsername(event.target && event.target.value); }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target && event.target.value);
    }
    return (
        <form className={clsx(classes.h100, classes.mx1)} onSubmit={handleSubmit}>
            <Grid className={classes.h100} container direction="row" component="main" alignItems="center" justifyContent="center">
                <Card className={classes.mx1}>
                    <CardHeader title="Регистрация" />
                    <CardContent>
                        <Grid>
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                variant="outlined"
                                margin="normal"
                                placeholder="Введите имя пользователя"
                                label="Имя пользователя"
                                name="userName"
                                autoComplete="username"
                                value={login}
                                onChange={handleUserNameChange}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Пароль"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </Grid>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="phone"
                            label="Номер телефона"
                            type="phone"
                            value={phone}
                            onChange={(event) => { setPhone(event && event.target.value) }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(event) => { setEmail(event && event.target.value) }}
                        />
                        <Grid container direction="row" className={classes.mt1}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading || !formErrors.isValid || clientOrBenefactor}
                                onClick={() => setClientOrBenefactor(true)}
                            >
                                Ищу помощь
                            </Button>
                            <Button
                                className={classes.mt2}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={loading || !formErrors.isValid}
                            >
                                {!loading && <div>Зарегистрироваться</div>}
                                {loading && <CircularProgress size={24} />}
                            </Button>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Link href="/sign-in" variant="body2">
                                    Уже есть аккаунт?
                                </Link>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                {clientOrBenefactor && <Card className={clsx(classes.mt3, classes.mx1, classes.mb3)}>
                    <CardHeader title="Данные компании"
                        action={
                            <IconButton onClick={() => setClientOrBenefactor(false)} aria-label="settings">
                                <Close />
                            </IconButton>
                        } />
                    <CardContent>
                        <Grid>
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                variant="outlined"
                                margin="normal"
                                placeholder="Введите ИНН"
                                label="ИНН"
                                value={inn}
                                onChange={(event) => { setINN(event && event.target.value) }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="КПП"
                                value={kpp}
                                onChange={(event) => { setKPP(event && event.target.value) }}
                            />
                        </Grid>
                        <Grid>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="ОГРН"
                                value={ogrn}
                                onChange={(event) => { setOgrn(event && event.target.value) }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Номер счета"
                                value={personalBankAccountn}
                                onChange={(event) => { setPersonalBankAccount(event && event.target.value) }}
                            />
                        </Grid>
                    </CardContent>
                </Card>}
                <Snackbar
                    open={open}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        severity={variant}>
                        {message}
                    </Alert>
                </Snackbar>
            </Grid>
        </form>
    );
});