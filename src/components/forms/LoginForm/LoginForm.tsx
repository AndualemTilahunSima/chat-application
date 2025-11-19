import "./LoginForm.css";
import { type FormEvent } from "react";
import { MessageCircleIcon } from "../../Icons/MessageCircleIcon";
import { TextInput } from "../../ui/TextInput/TextInput";
import { Button } from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigate("/dashboard");
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
                    />

                    <label htmlFor="loginPassword">Password</label>

                    <TextInput
                        required
                        type="password"
                        id="loginPassword"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />
                    <Button type="submit">Sign in</Button>
                </form>
            </div>
        </div>
    );
}
