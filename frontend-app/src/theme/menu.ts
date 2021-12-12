import { Theme } from "@mui/material";

export const menuStyles = (theme: Theme) => ({
    selectedItem: {
        borderRight: `3px solid ${theme.palette.primary.dark} !important`
    },
    selectedMobileItem: {
        color: `${theme.palette.primary.main} !important`,
        backgroundColor: theme.palette.primary.light
    },
    menu: {
        borderRight: `1px solid ${theme.palette.grey[300]}`
    }
});