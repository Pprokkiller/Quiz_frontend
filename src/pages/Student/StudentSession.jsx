import { useEffect, useState } from "react";
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

    const getSession = async () => {

        try {

            const response = await api.get(
                `/session/${sessionId}`
            );

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
    };


    // ==========================================
    // INITIAL LOAD + POLLING
    // ==========================================

    useEffect(() => {

        // Get session immediately
        getSession();


        // Then check every 2 seconds
        const interval = setInterval(() => {

            getSession();

        }, 2000);


        // IMPORTANT:
        // Stop polling when student leaves page

        return () => {

            clearInterval(interval);

        };

    }, [sessionId]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="student-session-page">

                <div className="student-session-card">

                    <div className="session-spinner"></div>

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


            {/* CARD */}

            <div className="student-session-card">


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


                <h1>
                    You're In!
                </h1>


                <p className="session-description">

                    You've successfully joined
                    the quiz session.

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
                            Stay on this page — we'll
                            automatically let you know
                            when it begins.

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

                            Your teacher has started
                            the quiz.

                        </p>

                        <button
                            onClick={() => {

                                navigate(
                                    `/student/session/${sessionId}/quiz`
                                );

                            }}
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