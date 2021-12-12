import { ClassNames } from "@emotion/react";
import { Modal, Box, Typography, Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, TextField, Grid, DialogContent, DialogActions, Button, InputAdornment } from "@mui/material";
import { blue } from "@mui/material/colors";
import { withStyles, WithStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { bootstrap, colors } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";

const styles = mergeStyles(bootstrap, colors);
interface Props extends WithStyles<typeof styles> {
    opened: boolean;
    onClose: () => void;
    onPaymentCreate: (amount: number, comment: string) => void;
}

export const ClientRequest = withStyles(styles)(function (props: Props) {
    const {
        opened,
        classes,
        onClose,
        onPaymentCreate
    } = props

    useEffect(() => {
        if(props.opened)
            setAmount(0);
            setComment('');
    }, [props.opened]);

    const [amount, setAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    return (
        <Dialog onClose={onClose} open={opened}>
            <DialogTitle>Введите данные платежа</DialogTitle>
            <DialogContent className={classes.p1}>
                <Grid container direction="column">
                    <TextField placeholder="Введите номер карты" />
                    <Grid className={classes.mt1} container direction="row">
                        <TextField className={classes.mr1} placeholder="Введите дату" />
                        <TextField className={classes.ml1} placeholder="Введите CVV" />
                    </Grid>
                    <TextField value={amount} onChange={(event) => setAmount(parseFloat(event && event.target.value))} className={classes.mt1} type="number" placeholder="Введите сумму пожертвования"
                     InputProps={{
                        endAdornment: <InputAdornment position="end">&#8381;</InputAdornment>,
                    }} />
                    <TextField multiline value={comment} onChange={(event) => setComment(event && event.target.value || '')} className={classes.mt1} placeholder="Комментарий"/>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onPaymentCreate(amount, comment)}>ОК</Button>
                <Button color="inherit" onClick={onClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
})