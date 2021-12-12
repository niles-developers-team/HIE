import { CircularProgress, Container, Drawer, Grid, IconButton, List, TextField, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import { Close, Send } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { RouteProps } from "react-router-dom";
import { AppState, Feed, ClientRequest, RequestPriorities, RequestStatuses, Comment, Payment, PaymentStatuses, Benefactor } from "../../models";
import { bootstrap } from "../../theme";
import { mergeStyles } from "../../utilities/mergeStyles";
import { FeedComponent } from "./Feed";
import { commentActions } from "../../store/commentStore";

import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../theme/colors";
import { ClientRequest as ClientRequestComponent } from "./ClientRequest";
import { paymentActions } from "../../store/paymentStore";

const styles = mergeStyles(bootstrap, colors);
interface Props extends RouteProps, WithStyles<typeof styles> { }



const feeds: Feed[] = [{
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}, {
    request: {
        amount: 100,
        deadlineDate: '2021-12-11',
        description: 'Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!Дайте денег!!!!',
        priority: RequestPriorities.Medium,
        status: RequestStatuses.InProgress,
        totalAmount: 333
    },
    user: {
        contactPhone: '+7(000)000-00-00',
        followersCount: 100,
        followsCount: 333,
        login: 'microsoft'
    },
    paymentsCount: 333333,
    date: '2021-12-12 12:33'
}];

export const Home = withStyles(styles)(function (props: Props) {
    const { classes } = props;

    const dispatch = useDispatch();

    const [selectedFeed, setSelectedFeed] = useState<Feed>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [commentsOpened, setCommentsOpened] = useState<boolean>();
    const [paymentOpened, setPaymentOpened] = useState<boolean>();

    const { commentsState, userState } = useSelector((state: AppState) => ({
        commentsState: state.commentsState,
        userState: state.userState,
        paymentState: state.paymentState,
    }));

    useEffect(() => {
        if (!commentsState.modelsLoading)
            setComments(commentsState.models);

    }, [commentsState.modelsLoading]);

    function handleCommentsToggle(feed: Feed) {
        setCommentsOpened(!commentsOpened);
        if (!commentsOpened) {
            dispatch(commentActions.getComments({ requestId: feed.request?.id }));
            setSelectedFeed(feed);
        }
    }

    function handleCommentSend(text: string, request?: ClientRequest, parent?: Comment) {
        if (userState.authenticating === true) return;
        const currentUser = userState.currentUser;
        dispatch(commentActions.saveComment({ request: request, text: text || '', user: currentUser, parent }));
    }

    function handlePayment(feed: Feed) {
        setSelectedFeed(feed);
        setPaymentOpened(true);
    }

    function handlePaymentClosed() {
        setSelectedFeed(undefined);
        setPaymentOpened(false);
    }

    function handlePaymentCreate(amount: number, comment: string) {
        let benefactor: Benefactor | undefined;
        if (userState.authenticating === false) {
            benefactor = userState.currentUser?.benefactor;
        }

        const payment: Payment = {
            amount: amount,
            comment: comment,
            status: PaymentStatuses.InProgress,
            request: selectedFeed?.request || undefined,
            benefactor: benefactor
        };

        dispatch(paymentActions.savePayment(payment));

        handlePaymentClosed();
    }

    const feedsComponents = feeds.map((feed, index) => {
        if (feed.request)
            feed.request.id = index;
        return (<FeedComponent
            key={index}
            isCommentsOpened={commentsOpened && selectedFeed?.request?.id === feed.request?.id || false}
            comments={comments}
            commentsLoading={commentsState.modelsLoading}
            onCommentsToggle={handleCommentsToggle}
            onPayment={handlePayment}
            onCommentSend={handleCommentSend}
            className={clsx(classes.w100, (index !== feeds.length - 1 ? classes.mb2 : ''))}
            feed={feed} />);
    });

    return (
        <Container maxWidth="sm">
            <Grid className={classes.py4} container direction="column" component="main" alignItems="center" justifyContent="start">
                {loading && <CircularProgress />}
                {feedsComponents}
            </Grid>
            <ClientRequestComponent opened={paymentOpened || false} onClose={handlePaymentClosed} onPaymentCreate={handlePaymentCreate} />
        </Container>
    );
});