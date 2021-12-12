import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { Home, Messenger, SearchComponent, Me, Signin, NotFound, Signup, Layout } from ".";
import { AppState } from "../models";
import { ChatComponent } from "./messenger/Chat";

export function RoutesSwitch() {
    const { userState } = useSelector((state: AppState) => ({ userState: state.userState }));
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!userState.authenticating && !userState.authenticated)
            if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {

                setAuthenticated(false);
                return;
            }

        if (userState.authenticating || (!userState.authenticating && !userState.authenticated)) {
            navigate('sign-in');

            setAuthenticated(false);
            return;
        }

        setAuthenticated(true);
    }, [userState.authenticating, location]);

    return (
        <Routes >
            {authenticated ? (
                <>
                    <Route index element={<Layout><Home /></Layout>} />
                    <Route path="messenger" element={<Layout><Messenger /></Layout>} />
                    <Route path="messenger/:recepientId/:requestId" element={<Layout><ChatComponent /></Layout>} />
                    <Route path="search" element={<Layout><SearchComponent /></Layout>} />
                    <Route path="me" element={<Layout><Me /></Layout>} />
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
    )
}
