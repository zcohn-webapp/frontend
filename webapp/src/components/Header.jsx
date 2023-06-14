import { Nav, Navbar, Container } from 'react-bootstrap';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Header = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const { auth } = useAuth();

    const handleLogoutClick = async () => {
        await logout();
        navigate('/');
    }

    return (
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect >
                <Container>
                    <Navbar.Brand href='/'>Tic-tac-toe</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>

                        { auth?.accessToken ?

                            <Nav className='ms-auto'>
                            <Nav.Link href='/leaderboard'>
                                    Leaderboard
                                </Nav.Link>
                                <Nav.Link href='/user'>
                                    User Info
                                </Nav.Link>
                                <Nav.Link href='/play'>
                                    Play
                                </Nav.Link>
                                <Nav.Link href='/links'>
                                    Links
                                </Nav.Link>
                                <Nav.Link onClick={() => handleLogoutClick()}>
                                    Log Out
                                </Nav.Link>
                            </Nav>

                        :

                            <Nav className='ms-auto'>
                                <Nav.Link href='/leaderboard'>
                                    Leaderboard
                                </Nav.Link>
                                <Nav.Link href='/login'>
                                    Log In
                                </Nav.Link>
                                <Nav.Link href='/register'>
                                    Sign Up
                                </Nav.Link>
                            </Nav> }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;
