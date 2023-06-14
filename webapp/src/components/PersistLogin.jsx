import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import { Container, Card, Button } from 'react-bootstrap';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async() => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                /* Helps avoid infinite loop */
                isMounted && setIsLoading(false)
            }
        }

        auth?.accessToken ? setIsLoading(false) : verifyRefreshToken();

        return () => isMounted = false;
    },[])

    return (
        <>
            { isLoading ?
                <div>
                    <p>Must be logged in!</p>

                    <Button variant="primary" href='/login' className="me-3">
                        Sign In
                    </Button>
                </div>
            : <Outlet /> }
        </>
    )
}

export default PersistLogin;
