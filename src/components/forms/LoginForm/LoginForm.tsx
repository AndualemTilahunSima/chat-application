import "./LoginForm.css";
import { useEffect, useState, type FormEvent } from "react";
import { MessageCircleIcon } from "../../Icons/MessageCircleIcon";
import { TextInput } from "../../ui/TextInput/TextInput";
import { Button } from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { loginUser, selectAuthError, selectAuthLoading, selectAuthProfile } from "../../../store/slices/authSlice";
import { loadChatThreads } from "../../../store/slices/chatThreadSlice";


export function LoginForm() {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const profile = useAppSelector(selectAuthProfile);

    // if(profile){
    //     navigate("/dashboard");
    // }

    useEffect(() => {
        if (profile != null) {
            navigate("/dashboard");
            dispatch(loadChatThreads());
        }
    }, [profile, dispatch]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(loginUser({ email, password }));
    }

    return (
        <div className="login-container">
            <div className="login-header">
                <div className="image-wrapper">
                    <MessageCircleIcon size={32} color="#fff" />
                </div>
                <h4 className="chat-app-web">ChatApp Web</h4>
                <h4 className="sign-in">Sign in to continue</h4>
            </div>

            <div className="login-body">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="loginEmail">Email</label>

                    <TextInput
                        required
                        type="email"
                        id="loginEmail"
                        placeholder="Enter your email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="loginPassword">Password</label>

                    <TextInput
                        required
                        type="password"
                        id="loginPassword"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit">Sign in</Button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}
