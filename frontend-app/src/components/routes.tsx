import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router";
import { RouteProps } from "react-router-dom";
import { Home, Messenger, Search, Me, Signin, NotFound, ErrorPage, Signup } from ".";
import { ApplicationError, AppState, UnauthorizedError } from "../models";

export function RoutesSwitch() {
    const { userState } = useSelector((state: AppState) => ({ userState: state.userState }));
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userState.authenticating || (!userState.authenticating && !userState.authenticated)) {
            navigate('sign-in');
            return;
        }

        setAuthenticated(true);
    }, [userState]);

    return (
        <ErrorBoundary>
            <Routes >
                {authenticated ? (
                    <>
                        <Route index element={<Home />} />
                        <Route path="messenger" element={<Messenger />} />
                        <Route path="search" element={<Search />} />
                        <Route path="me" element={<Me />} />
                    </>
                ) : (
                    <>
                        <Route path='sign-in' element={<Signin />} />
                        <Route path='sign-up' element={<Signup />} />
                    </>
                )
                }
                <Route path='*' element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    )
}

interface State {
    applicationError: ApplicationError | null;
    unauthorizedError: boolean;
}

class ErrorBoundary extends React.Component<RouteProps, State> {
    constructor(props: any) {
        super(props);
        this.state = { applicationError: null, unauthorizedError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        if (error instanceof UnauthorizedError)
            return { unauthorizedError: true };

        return { unauthorizedError: false, applicationError: error as ApplicationError };
    }

    render() {
        // const navigate = useNavigate();
        // if (this.state.unauthorizedError)
        //     navigate('sign-in');

        if (this.state.applicationError)
            return <ErrorPage message={this.state.applicationError.message}></ErrorPage>

        return this.props.children;
    }
}