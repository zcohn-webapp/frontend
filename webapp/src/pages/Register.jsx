import { useRef, useState, useEffect } from "react";
import { faCheck, faTimeline, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ref } from "react";
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/* Must start with letter, be followed by 4-20 of: {letter, digit, hyphen, underscore} */
const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/;
/* Must contain uppercase, lowercase, digit, and special symbol, and be between 8-50 chars */
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,50}$/;
const REGISTER_URL = '/register';

const Register = () => {
    /* useRef is similar to state (persists between renders) but change in ref does not cause re-rendering */
    const emailRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('')
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []) /* This code runs once, upon loading page */

    useEffect(() => {
        /* Test whether username meets given regex reqs and update validName accordingly */
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]) /* This code is run anytime the user changes */

    useEffect(() => {
        /* Check whether email is valid and update validEmail accordingly */
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        /* Check whether given password meets given regex reqs, update validPassword accordingly */
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
        /* Check if password and verify-password match, update accordingly */
        const match = (password === matchPassword);
        setValidMatch(match);
    }), [password, matchPassword] /* This code is run anytime password or verify-password are changed */

    useEffect(() => {
        setErrMsg('');
    }, [user, password, matchPassword]) /* Clear the Error Msg any time the user makes any change */

    const handleSubmit = async (event) => {
        event.preventDefault();
        /* In case button was enabled with a JS hack */
        const valid_username = USER_REGEX.test(user);
        const valid_password = PWD_REGEX.test(password);
        if (!valid_username || !valid_password) {
                setErrMsg("Invalid entry");
                return;
        }

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ email: email, username: user, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

            setSuccess(true);

            setEmail('');
            setUser('');
            setPassword('');
            setMatchPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No response from server');
            }
            else if (err.response?.status === 403) {
                setErrMsg('Email or Username not available');
            }
            else {
                console.log(err.response)
                setErrMsg(err.response.data.message);
            }


            errRef.current.focus()
        }
    }

  return (
    <>
    {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <Link to="/login">Sign in</Link>
                </p>
            </section>
        ) : (
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "hide"}>{errMsg}</p>

        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

        <label htmlFor="email">
                Email:
                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={(validEmail || !email) ? "hide" : "invalid"} />
            </label>
            <input type="text"
             id="email"
             ref={emailRef}
             autoComplete="off"
             onChange={(event) => setEmail(event.target.value)}
             required
             aria-describedby="email_note"
             onFocus={() => setEmailFocus(true)}
             onBlur={() => setEmailFocus(false)}
            />
            <p id="email_note" className={(emailFocus && email && !validEmail) ? "instructions" : "hide"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must be valid email.
            </p>

            <label htmlFor="username">
                Username:
                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={(validName || !user) ? "hide" : "invalid"} />
            </label>
            <input type="text"
             id="username"
             value={user}
             autoComplete="off"
             onChange={(event) => setUser(event.target.value)}
             required
             aria-describedby="username_note"
             onFocus={() => setUserFocus(true)}
             onBlur={() => setUserFocus(false)}
            />
            <p id="username_note" className={(userFocus && user && !validName) ? "instructions" : "hide"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must be between 4-20 characters.<br />
                Must begin with a letter.<br />
                Must consist only of letters, numbers, underscores, and hyphens.
            </p>


            <label htmlFor="password">
                Password:
                    <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                required
                aria-describedby="password_note"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
            />
            <p id="password_note" className={(passwordFocus && !validPassword) ? "instructions" : "hide"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 50 characters.<br />
                Must include uppercase letter, lowercase letter, a number, and a special character.<br />
                Allowed special characters: !@#$%^&*
            </p>


            <label htmlFor="confirm_password">
            Confirm Password:
                <FontAwesomeIcon icon={faCheck} className={(validMatch && matchPassword) ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={(validMatch || !matchPassword) ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="confirm_password"
                onChange={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                required
                aria-describedby="password_confirm_note"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="password_confirm_note" className={(matchFocus && !validMatch) ? "instructions" : "hide"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
            </p>


            <button disabled={(!validEmail || !validName || !validPassword || !validMatch) ? true: false}>
                Sign Up
            </button>
        </form>
        <p>
            Already registered?<br />
            <span className="line">
                <Link to="/login">Sign In</Link>
            </span>
        </p>
    </section>
    )}
  </>
  )
}

export default Register;
