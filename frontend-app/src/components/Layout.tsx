import { BottomNavigation, BottomNavigationAction, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { AccountCircle, Home as HomeIcon, Forum, Search, ExitToApp } from "@mui/icons-material";
import { RouteProps, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'
import { Link } from "react-router-dom";
import { bootstrap, menuStyles } from "../theme";
import { mergeStyles } from "../utilities/mergeStyles";
import { WithStyles, withStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userStore";

import clsx from "clsx";
import { useEffect, useState } from "react";

const styles = mergeStyles(bootstrap, menuStyles);

interface Props extends RouteProps, WithStyles<typeof styles> { }

export const Layout = withStyles(styles)(function (props: Props): JSX.Element {
    const { classes } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [path, setPath] = useState<string>('/');

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const location = useLocation();

    function isMenuItemSelected(menuItemPath: string): boolean {

        if (menuItemPath.lastIndexOf('/') > 0)
            return location.pathname.includes(menuItemPath);

        return location.pathname === menuItemPath;
    }

    useEffect(() => {
        setPath(location.pathname);
    }, [location]);

    if (isDesktopOrLaptop) {
        return (
            <Grid className={clsx(classes.h100, classes.overflowContainer)} container direction="row">
                <Grid className={clsx(classes.h100, classes.menu)} item xs={2} container direction="column" textAlign="center" justifyContent="center">
                    <Typography color="primary" className={classes.mt1} variant="h4">HELP IT EASY</Typography>
                    <Grid item xs />
                    <List>
                        <ListItemButton className={isMenuItemSelected('/') && classes.selectedItem || ''} selected={isMenuItemSelected('/')} key="home" component={Link} to={'/'}>
                            <ListItemIcon>
                                <HomeIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText>Лента</ListItemText>
                        </ListItemButton>
                        <ListItemButton className={isMenuItemSelected('/search') && classes.selectedItem || ''} selected={isMenuItemSelected('/search')} key="search" component={Link} to={'/search'}>
                            <ListItemIcon>
                                <Search color="primary" />
                            </ListItemIcon>
                            <ListItemText>Поиск</ListItemText>
                        </ListItemButton>
                        <ListItemButton className={isMenuItemSelected('/messenger') && classes.selectedItem || ''} selected={isMenuItemSelected('/messenger')} key="messanger" component={Link} to={'/messenger'}>
                            <ListItemIcon>
                                <Forum color="primary" />
                            </ListItemIcon>
                            <ListItemText>Мессенджер</ListItemText>
                        </ListItemButton>
                        <ListItemButton className={isMenuItemSelected('/me') && classes.selectedItem || ''} selected={isMenuItemSelected('/me')} key="me" component={Link} to={'/me'}>
                            <ListItemIcon>
                                <AccountCircle color="primary" />
                            </ListItemIcon>
                            <ListItemText>Профиль</ListItemText>
                        </ListItemButton>
                    </List>
                    <Grid item xs />
                </Grid>
                <Grid xs={10} className={classes.overflowWrapper}>
                    {props.children}
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid className={classes.h100} container direction="column">
            {props.children}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation

                    value={path}
                    onChange={(event, newValue) => {
                        if (newValue)
                            navigate(newValue);
                    }}
                >
                    <BottomNavigationAction value="/" className={isMenuItemSelected('/') && classes.selectedMobileItem || ''} icon={<HomeIcon />} />
                    <BottomNavigationAction value="/search" className={isMenuItemSelected('/search') && classes.selectedMobileItem || ''} icon={<Search />} />
                    <BottomNavigationAction value="/messenger" className={isMenuItemSelected('/messenger') && classes.selectedMobileItem || ''} icon={<Forum />} />
                    <BottomNavigationAction value="/me" className={isMenuItemSelected('/me') && classes.selectedMobileItem || ''} icon={<AccountCircle />} />
                </BottomNavigation>
            </Paper>
        </Grid>
    );
});
