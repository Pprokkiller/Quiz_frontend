import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./LiveSession.css";

function LiveSession() {
    const location = useLocation();

const {
    sessionId,
    quizId,
    joinCode
} = location.state || {};

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [copied, setCopied] = useState(false);

    // ==========================================
    // Create Live Session
    // ==========================================

    const createSession = async () => {
        if (!quizId) {
            setError("No quiz selected.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/session/create", {
                quiz_id: quizId
            });

            setSession(response.data.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create live session."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Create session automatically
    // ==========================================

    useEffect(() => {
        createSession();
    }, []);

    // ==========================================
    // Copy Join Code
    // ==========================================

    const copyJoinCode = async () => {
        if (!session?.join_code) return;

        try {
            await navigator.clipboard.writeText(
                session.join_code
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {
            console.error(error);
        }
    };

    // ==========================================
    // Start Session
    // ==========================================

    const startSession = async () => {
        if (!session) return;

        try {
            setLoading(true);
            setError("");

            const response = await api.put(
                `/session/start/${session.session_id}`
            );

            setSession(response.data.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to start session."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // End Session
    // ==========================================

    const endSession = async () => {
        if (!session) return;

        const confirmed = window.confirm(
            "Are you sure you want to end this session?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            setError("");

            const response = await api.put(
                `/session/end/${session.session_id}`
            );

            setSession(response.data.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to end session."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Loading
    // ==========================================

    if (loading && !session) {
        return (
            <div className="live-session-page">
                <div className="live-loading">
                    <div className="loading-spinner"></div>

                    <h2>Creating Live Session...</h2>

                    <p>
                        Generating a join code for your students.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // Render
    // ==========================================

    return (
        <div className="live-session-page">

            {/* Top Navigation */}

            <header className="live-topbar">

                <div
                    className="live-logo"
                    onClick={() =>
                        navigate("/teacher/dashboard")
                    }
                >
                    <div className="live-logo-mark">
                        Q
                    </div>

                    <span>QuizVerse</span>
                </div>

                <div className="teacher-info">

                    <div className="teacher-avatar">
                        P
                    </div>

                    <div>
                        <strong>Teacher</strong>

                        <small>
                            TEACHER VIEW
                        </small>
                    </div>

                </div>

            </header>


            {/* Main */}

            <main className="live-session-main">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/teacher/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>


                <div className="live-header">

                    <div>

                        <span className="live-label">
                            LIVE SESSION
                        </span>

                        <h1>
                            Waiting for Students
                        </h1>

                        <p>
                            Share the join code with your students.
                        </p>

                    </div>

                    {session && (
                        <div
                            className={`session-status ${
                                session.status?.toLowerCase()
                            }`}
                        >
                            <span></span>

                            {session.status}
                        </div>
                    )}

                </div>


                {error && (
                    <div className="live-error">
                        {error}
                    </div>
                )}


                {session && (

                    <div className="live-content">

                        {/* Join Code Card */}

                        <section className="join-code-card">

                            <div className="card-icon">
                                🔗
                            </div>

                            <h2>
                                Join Code
                            </h2>

                            <p>
                                Students can use this code
                                to join your quiz.
                            </p>


                            <div className="join-code">
                                {session.join_code}
                            </div>


                            <button
                                className="copy-code-button"
                                onClick={copyJoinCode}
                            >
                                {copied
                                    ? "✓ Copied!"
                                    : "Copy Code"
                                }
                            </button>


                            <div className="share-message">

                                <span>
                                    📢
                                </span>

                                Share this code with
                                your students.

                            </div>

                        </section>


                        {/* Session Information */}

                        <section className="session-info-card">

                            <h2>
                                Session Information
                            </h2>


                            <div className="info-row">

                                <span>
                                    Session ID
                                </span>

                                <strong>
                                    #{session.session_id}
                                </strong>

                            </div>


                            <div className="info-row">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {session.status}
                                </strong>

                            </div>


                            <div className="info-row">

                                <span>
                                    Students Joined
                                </span>

                                <strong>
                                    0
                                </strong>

                            </div>

                        </section>

                    </div>

                )}


                {/* Controls */}

                {session && (
                    <div className="session-controls">

                        {session.status === "Waiting" && (

                            <button
                                className="start-session-button"
                                onClick={startSession}
                                disabled={loading}
                            >
                                {loading
                                    ? "Starting..."
                                    : "Start Session"
                                }
                            </button>

                        )}


                        {session.status === "Live" && (

                            <button
                                className="end-session-button"
                                onClick={endSession}
                                disabled={loading}
                            >
                                {loading
                                    ? "Ending..."
                                    : "End Session"
                                }
                            </button>

                        )}


                        {session.status === "Ended" && (

                            <button
                                className="back-dashboard-button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/dashboard"
                                    )
                                }
                            >
                                Back to Dashboard
                            </button>

                        )}

                    </div>
                )}

            </main>

        </div>
    );
}

export default LiveSession;