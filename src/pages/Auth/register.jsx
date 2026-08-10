import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";

import logo from "../../assets/hero.png";

import "./auth.css";

function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();


    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    });


    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);



    // =========================
    // Handle Input Changes
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };



    // =========================
    // Handle Register
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // Basic validation

        if (
            !formData.full_name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.role
        ) {

            setError("Please fill in all fields.");

            return;
        }



        // Check password

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");

            return;
        }



        // Password length

        if (formData.password.length < 6) {

            setError("Password must be at least 6 characters.");

            return;
        }



        try {

            setLoading(true);


            // Remove confirmPassword
            // because backend does not need it

            const userData = {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };


            const data = await register(userData);


            console.log("Registration successful:", data);


            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            // Go to login after registration

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (err) {

            console.error("Registration error:", err);


            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Registration failed. Please try again.";


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
                    Create Account
                </h1>


                <p className="auth-subtitle">
                    Create your QuizVerse account.
                </p>



                {/* Error */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}



                {/* Success */}

                {success && (

                    <div className="success-message">

                        {success}

                    </div>

                )}



                {/* Register Form */}

                <form onSubmit={handleSubmit}>


                    {/* Full Name */}

                    <div className="form-group">

                        <label htmlFor="full_name">
                            Full Name
                        </label>


                        <input
                            id="full_name"
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />

                    </div>



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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />

                    </div>



                    {/* Confirm Password */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>


                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />

                    </div>



                    {/* Role */}

                    <div className="form-group">

                        <label htmlFor="role">
                            Register As
                        </label>


                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select your role
                            </option>

                            <option value="teacher">
                                Teacher
                            </option>

                            <option value="student">
                                Student
                            </option>

                        </select>

                    </div>



                    {/* Register Button */}

                    <button
                        type="submit"
                        className="auth-button auth-button-primary"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>



                {/* Divider */}

                <div className="auth-divider">

                    <span>OR</span>

                </div>



                {/* Login Button */}

                <button
                    type="button"
                    className="auth-button auth-button-secondary"
                    onClick={() => navigate("/login")}
                >

                    Log In

                </button>



                {/* Already Account */}

                <p className="register-link">

                    Already have an account?{" "}

                    <span
                        onClick={() => navigate("/login")}
                    >
                        Log in
                    </span>

                </p>


            </div>

        </div>

    );

}


export default Register;