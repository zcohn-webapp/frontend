import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';

const Hero = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const { auth } = useAuth();

    const signOut = async () => {
        await logout();
        navigate('/');
    }

    return (
        <div className="py-5">
            <Container className='d-flex justify-content-center'>
                <Card className='p-5 d-flex flex-column align-items-center her0-card bg-light w-75'>
                    <h1 className="text-center mb-4">Tic-tac-toe App</h1>
                    <p className="text-center mb-4">
                        This is a tic-tac-toe app that uses MERN and JWT authentication.
                        It also uses the React Bootstrap library.
                    </p>
                    <div className="d-flex">
                        {
                            !auth?.accessToken ?
                        <>
                            <Button variant="primary" href='/login' className="me-3">
                                Sign In
                            </Button>
                            <Button variant="secondary" href='/register' className="me-3">
                                Register
                            </Button>
                        </>
                        :
                            <Button variant="primary" onClick={signOut} className="me-3">
                                Log Out
                            </Button>
                    }
                    </div>
                </Card>
            </Container>
        </div>
    )
}

export default Hero;
