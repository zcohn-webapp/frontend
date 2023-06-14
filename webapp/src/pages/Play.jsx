import { useState } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const PLAY_URL = '/play';

function Play() {
    const axiosPrivate = useAxiosPrivate();
    const [gameResult, setGameResult] = useState(null);
    const [gamePlayed, setGamePlayed] = useState(false);

    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
            const response = await axiosPrivate.get(PLAY_URL);

            const win = response?.data?.win;
            console.log(win)

            setGameResult(win ? 'Game won!' : 'Game lost!');
            setGamePlayed(true);

        } catch (err) {
            if (!err?.response) {
                setGameResult("No response from server");
            } else if (err.response?.status === 400) {
                setGameResult("Missing access token");
            } else if (err.response?.status === 401) {
                setGameResult("Unauthorized token");
            } else {
                setGameResult("API call failed");
            }
        }
    }

    return (

        <section>

            <h1>Play Game</h1>

            { gameResult && <p>{gameResult}</p> }

            <form onSubmit={handleSubmit}>
                <button>{ gamePlayed ? 'Play again' : 'Play' }</button>
            </form>

        </section>
    )
}

export default Play;
