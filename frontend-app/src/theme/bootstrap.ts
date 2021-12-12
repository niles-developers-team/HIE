const margin: number = 0.5;

export const bootstrap = () => ({
    h100: {
        height: '100%'
    },
    w100: {
        width: '100%'
    },
    p1: {
        padding: '1em'
    },
    px1: {
        padding: '0 1em'
    },
    p2: {
        padding: `${margin * 2}em !important`
    },
    p4: {
        padding: '4em'
    },
    py3: {
        padding: '3em ',
    },
    pt2: {
        paddingTop: `${margin * 2}em !important`
    },
    pt3: {
        paddingTop: `${margin * 3}em !important`
    },
    py4: {
        paddingTop: `${margin * 4}em !important`
    },
    ml1: {
        marginLeft: `${margin}em !important`
    },
    ml2: {
        marginLeft: `${margin}em !important`
    },
    mr1: {
        marginRight: `${margin * 2}em !important`
    },
    mr2: {
        marginRight: `${margin * 2}em !important`
    },
    mr3: {
        marginRight: `${margin * 3}em !important`
    },
    mr4: {
        marginRight: `${margin * 4}em !important`
    },
    mt1: {
        marginTop: `${margin}em !important`
    },
    mt2: {
        marginTop: `${margin * 2}em !important`
    },
    mt3: {
        marginTop: `${margin * 3}em !important`
    },
    mt4: {
        marginTop: `${margin * 4}em !important`
    },
    mb2: {
        marginBottom: `${margin * 2}em !important`
    },

    overflowContainer: {
        overflow: 'hidden'
    },
    overflowWrapper: {
        maxHeight: '100%',
        overflow: 'auto'
    }
});