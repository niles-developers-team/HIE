import { Grid, Typography } from "@mui/material";

export const NotFound = function () {
    return (
        <Grid container direction="column" component="main" alignItems="center" justifyContent="center">
            <Typography variant="h1" component="h1">404... Not found...</Typography>
        </Grid>
    );
};