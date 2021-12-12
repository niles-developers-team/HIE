import { Grid, Typography } from "@mui/material";
import { withStyles, WithStyles } from "@mui/styles";
import { bootstrap } from "../../theme";
import '../../theme/bootstrap.ts';
import { mergeStyles } from "../../utilities/mergeStyles";

const styles = mergeStyles(bootstrap);

interface Props extends WithStyles<typeof styles> { }

export const NotFound = withStyles(styles)(function (props: Props) {
    const { classes } = props;

    return (
        <Grid className={classes.h100} container direction="column" component="main" alignItems="center" justifyContent="center">
            <Typography variant="h1" component="h1">404... Not found...</Typography>
        </Grid>
    );
});