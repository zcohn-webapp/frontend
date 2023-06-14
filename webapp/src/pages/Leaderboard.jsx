import { useState, useEffect } from "react";
import axios from '../api/axios';

const Leaderboard = () => {
    const [errMsg, setErrMsg] = useState('');
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        const getLeaders = async () => {
            try {
                const response = await axios.get('/leaderboard', { controller: controller.signal });
                setLeaders(response?.data?.leaders);
                setErrMsg('')

            } catch (err) {
                console.error(err);
                setErrMsg("Error retrieving leaderboard info from server");
            }
        }

        getLeaders();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <div>
            <p className={errMsg ? "errmsg" : "hide"}>{errMsg}</p>
            {
                leaders.map((user) => {
                    return (
                        <div key={user.username}><strong>{user.username}</strong>: {user.wins}-{user.losses}</div>
                    )
                })
            }
        </div>
    )
}

export default Leaderboard;
