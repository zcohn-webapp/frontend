import { Outlet } from "react-router-dom";
import Home from '../pages/Home'

const Layout = () => {
    return (
        <main className="App">
            <Outlet />
        </main>
    )
}

export default Layout;
