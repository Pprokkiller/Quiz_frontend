import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import "./StudentSession.css";


function StudentSession() {

    const { sessionId } = useParams();

    const navigate = useNavigate();

    const [session, setSession] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // GET SESSION
    // ==========================================

    const getSession = useCallback(async () => {

        try {

            let response;


            /*
             * If the URL contains a number,
             * it is a Session ID.
             *
             * Example:
             * /student/session/17
             */

            if (!isNaN(sessionId)) {

                response = await api.get(
                    `/session/${sessionId}`
                );

            }


            /*
             * If the URL contains letters,
             * it is a Join Code.
             *
             * Example:
             * /student/session/H1OISL
             */

            else {

                response = await api.get(
                    `/session/join/${sessionId}`
                );

            }


            const sessionData =
                response.data.data;


            setSession(sessionData);

            setError("");


        } catch (error) {

            console.error(
                "Failed to get session:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load quiz session."
            );

        } finally {

            setLoading(false);

        }

    }, [sessionId]);


    // ==========================================
    // INITIAL LOAD + POLLING
    // ==========================================

    useEffect(() => {

        if (!sessionId) {

            setError("Invalid session.");

            setLoading(false);

            return;

        }


        // Get session immediately

        getSession();


        // Poll every 2 seconds

        const interval = setInterval(() => {

            getSession();

        }, 2000);


        return () => {

            clearInterval(interval);

        };

    }, [sessionId, getSession]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="student-session-page">

                <div className="student-session-card">

                    <div className="session-spinner">
                    </div>

                    <h2>
                        Joining Quiz...
                    </h2>

                    <p>
                        Connecting to the quiz session.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="student-session-page">

                <div className="student-session-card">

                    <div className="session-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Join
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // SESSION NOT FOUND
    // ==========================================

    if (!session) {

        return (

            <div className="student-session-page">

                <div className="student-session-card">

                    <h2>
                        Session Not Found
                    </h2>

                    <p>
                        This quiz session could not be found.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="student-session-page">


            {/* LOGO */}

            <div className="student-session-logo">

                <div className="student-session-logo-mark">
                    Q
                </div>

                <span>
                    QuizVerse
                </span>

            </div>


            {/* SESSION CARD */}

            <div className="student-session-card">


                {/* ICON */}

                <div className="waiting-icon">
                    🚀
                </div>


                {/* STATUS */}

                <div
                    className={
                        session.status === "Live"
                            ? "session-badge live"
                            : session.status === "Ended"
                            ? "session-badge ended"
                            : "session-badge"
                    }
                >

                    <span></span>

                    {session.status}

                </div>


                {/* TITLE */}

                <h1>
                    You're In!
                </h1>


                <p className="session-description">
                    You've successfully joined the quiz session.
                </p>


                {/* JOIN CODE */}

                <div className="student-join-code">

                    {session.join_code}

                </div>


                {/* ============================
                    WAITING
                ============================ */}

                {session.status === "Waiting" && (

                    <div className="waiting-message">

                        <h3>
                            Waiting for your teacher
                        </h3>

                        <p>
                            The quiz hasn't started yet.
                            Stay on this page — the quiz
                            will begin when your teacher
                            starts the session.
                        </p>

                        <div className="polling-indicator">

                            <span></span>

                            Checking for updates...

                        </div>

                    </div>

                )}


                {/* ============================
                    LIVE
                ============================ */}

                {session.status === "Live" && (

                    <div className="live-message">

                        <h3>
                            🎉 Quiz is Live!
                        </h3>

                        <p>
                            Your teacher has started the quiz.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/student/session/${session.session_id}/quiz`
                                )
                            }
                        >
                            Start Quiz →
                        </button>

                    </div>

                )}


                {/* ============================
                    ENDED
                ============================ */}

                {session.status === "Ended" && (

                    <div className="ended-message">

                        <h3>
                            Session Ended
                        </h3>

                        <p>
                            This quiz session has ended.
                        </p>

                    </div>

                )}


                {/* LEAVE */}

                <button
                    className="leave-session-button"
                    onClick={() =>
                        navigate(
                            "/student/dashboard"
                        )
                    }
                >
                    ← Leave Session
                </button>


            </div>

        </div>

    );

}


export default StudentSession;