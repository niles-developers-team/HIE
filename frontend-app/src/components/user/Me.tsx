import { Grid, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import { bootstrap, colors } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";

import clsx from "clsx";
const styles = mergeStyles(bootstrap, colors);

interface Props extends WithStyles<typeof styles> { }

export const Me = withStyles(styles)(function (props: Props) {
    const { classes } = props;

    return(
        <Grid className={clsx(classes.h100, classes.secondaryColor)} container direction="column" component="main" alignItems="center" justifyContent="center">
            <Typography variant="h3" component="h3">Данная страница еще в разработке...</Typography>
        </Grid>
    );
})