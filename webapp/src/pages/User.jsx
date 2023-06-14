import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from '../hooks/useAuth';
import '../styles/user.css'

/* Must start with letter, be followed by 4-20 of: {letter, digit, hyphen, underscore} */
const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/;

const User = () => {
    const [userInfo, setUserInfo] = useState();
    const [editableFields, setEditableFields] = useState();
    const [editedFields, setEditedFields] = useState([]);
    const [editInProgress, setEditInProgress] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserInfo = async () => {
            try {
                const response = await axiosPrivate.get('/user', { controller: controller.signal });
                isMounted && setUserInfo(response?.data);
            } catch (err) {
                console.error(err);
            }
        }

        getUserInfo();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [editedFields]);

    const handleEdit = (field) => {
        setEditInProgress(true);

        if (!auth?.roles) {
          // User has no roles, editing is not allowed
          return;
        }

        const allowedFields = [];

        if (auth?.roles.includes("user")) {
            allowedFields.push("username");
        }

        if (auth?.roles.includes("editor")) {
            allowedFields.push("wins", "losses");
        }

        const fieldsToEdit = {};

        allowedFields.forEach(field => {
            fieldsToEdit[field] = true;
        })

        setEditableFields(fieldsToEdit);
    }

    const handleSubmit = async (event, field) => {
        event.preventDefault();
        let formObject = {};

        for (const field in editedFields) {
            formObject[editedFields[field]] = userInfo[editedFields[field]]
        }

        try {
            const response = await axiosPrivate.put('/user', JSON.stringify(formObject));

            setSuccess(true);
            setErrMsg('');
        } catch (err) {
            console.log(err.response)
            if (!err?.response) {
                setErrMsg('No response from server');
            }

            else if (err?.response?.data?.message) {
                console.log(err.response)
                setErrMsg(err.response.data.message);
            }

            else {
                setErrMsg('Unknown error from server')
            }
        }

        // Reset editable and edited fields
        setEditableFields({});
        setEditedFields([]);
        setEditInProgress(false);
    }

    const handleEditedField = (field, value) => {
        setUserInfo(prevInfo => ({ ...prevInfo, [field]: value }));
        if (editedFields.indexOf(field) === -1)
            editedFields.push(field)
    }

    const renderField = (field, label) => {
        if (editableFields && editableFields[field]) {
            return (
              <div>
                <strong>{label}:</strong>{" "}
                <input
                  type="text"
                  value={userInfo?.[field] || ""}
                  onChange={(e) =>
                    handleEditedField(field, e.target.value)
                  }
                />
              </div>
            );
          } else {
            return (
              <div>
                <strong>{label}:</strong> {JSON.stringify(userInfo?.[field])}
              </div>
            );
          }
    }


    return (
        <>
        { <article>

            <p className={errMsg ? "errmsg" : "hide"}>{errMsg}</p>

          <h2 className="header">User Info</h2>

          { userInfo && (
            <>
              {renderField("username", "Username")}
              {renderField("email", "Email")}
              {renderField("wins", "Wins")}
              {renderField("losses", "Losses")}
              {auth?.roles && auth?.roles.length > 0 && !editInProgress && (
                <button onClick={handleEdit}>Edit</button>
              )}
            </>
          )}
          {editableFields && Object.keys(editableFields).length > 0 && (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </article> }
        </>
    )
}


export default User
