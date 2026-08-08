import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";

import logo from "../../assets/hero.png";

import "./auth.css";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // Handle login
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Basic validation
        if (!formData.email || !formData.password) {

            setError("Please enter your email and password.");

            return;
        }


        try {

            setLoading(true);


            // Send login request through AuthContext
            const data = await login(
                formData.email,
                formData.password
            );


            console.log("Login successful:", data);


            // Redirect based on role
            if (data.user.role === "teacher") {

                navigate("/teacher/dashboard");

            } else if (data.user.role === "student") {

                navigate("/student/dashboard");

            } else {

                navigate("/");

            }


        } catch (err) {

            console.error("Login error:", err);


            // Backend error
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Invalid email or password.";


            setError(message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* Logo */}

                <img
                    src={logo}
                    alt="QuizVerse"
                    className="auth-logo"
                />


                {/* Heading */}

                <h1>
                    Welcome Back
                </h1>


                <p className="auth-subtitle">
                    Sign in to your QuizVerse account.
                </p>


                {/* Error */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* Login Form */}

                <form onSubmit={handleSubmit}>


                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>


                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* Password */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>


                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        className="auth-button auth-button-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Log In"
                        }

                    </button>

                </form>


                {/* Divider */}

                <div className="auth-divider">
                    <span>OR</span>
                </div>


                {/* Register */}

                <button
                    type="button"
                    className="auth-button auth-button-secondary"
                    onClick={() => navigate("/register")}
                >
                    Sign Up
                </button>


                {/* Back */}

                <p className="register-link">

                    Don't have an account?{" "}

                    <span
                        onClick={() => navigate("/register")}
                    >
                        Create one
                    </span>

                </p>


            </div>

        </div>

    );

}


export default Login;