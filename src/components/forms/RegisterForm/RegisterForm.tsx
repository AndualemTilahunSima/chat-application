import "./RegisterForm.css";
import { useEffect, useState, type FormEvent } from "react";
import { MessageCircleIcon } from "../../Icons/MessageCircleIcon";
import { TextInput } from "../../ui/TextInput/TextInput";
import { Button } from "../../ui/Button/Button";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { registerUser, selectAuthError, selectAuthLoading, selectAuthSuccessMessage, clearSuccessMessage } from "../../../store/slices/authSlice";


export function RegisterForm() {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const successMessage = useAppSelector(selectAuthSuccessMessage);

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Clear success message when component unmounts
        return () => {
            dispatch(clearSuccessMessage());
        };
    }, [dispatch]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(registerUser({ 
            email, 
            phoneNumber, 
            firstName, 
            lastName, 
            password 
        }));
    }

    function handleGoToLogin() {
        dispatch(clearSuccessMessage());
        navigate("/login");
    }

    return (
        <div className="register-container">
            <div className="register-header">
                <div className="image-wrapper">
                    <MessageCircleIcon size={32} color="#fff" />
                </div>
                <h4 className="chat-app-web">ChatApp Web</h4>
                <h4 className="sign-up">Sign up to continue</h4>
            </div>

            <div className="register-body">
                {successMessage ? (
                    <div className="success-message">
                        <p style={{ color: "#00bba7", fontWeight: "bold", marginBottom: "1rem" }}>
                            {successMessage}
                        </p>
                        <Button onClick={handleGoToLogin}>Go to Login</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="registerEmail">Email</label>
                        <TextInput
                            required
                            type="email"
                            id="registerEmail"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="registerPhone">Phone Number</label>
                        <TextInput
                            required
                            type="tel"
                            id="registerPhone"
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <label htmlFor="registerFirstName">First Name</label>
                        <TextInput
                            required
                            type="text"
                            id="registerFirstName"
                            placeholder="Enter your first name"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            minLength={2}
                            maxLength={100}
                        />

                        <label htmlFor="registerLastName">Last Name</label>
                        <TextInput
                            required
                            type="text"
                            id="registerLastName"
                            placeholder="Enter your last name"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            minLength={2}
                            maxLength={100}
                        />

                        <label htmlFor="registerPassword">Password</label>
                        <TextInput
                            required
                            type="password"
                            id="registerPassword"
                            placeholder="Enter your password (6-20 characters)"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            maxLength={20}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Sign up"}
                        </Button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                            Already have an account? <Link to="/login" style={{ color: "#00bba7", textDecoration: "none" }}>Sign in</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

