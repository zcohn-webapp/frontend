import { Link } from "react-router-dom"

const Links = () => {

    return (
        <section>
            <h1>Links</h1>
            <br />
            <h2>Public</h2>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <br />
            <h2>Private</h2>
            <Link to="/">Home</Link>
            <Link to="/user">User Info</Link>
            <Link to="/play">Play Game</Link>
            <Link to="/admin">Admin Page</Link>
        </section>
    )
}

export default Links
