import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import api from "../../services/api";

import "./StudentDashboard.css";


function StudentDashboard() {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ================================
    // Join Code
    // ================================

    const [joinCode, setJoinCode] = useState("");

    const [joining, setJoining] = useState(false);


    // ================================
    // Join Live Session
    // ================================

    const handleJoinSession = async () => {

        const code =
            joinCode.trim().toUpperCase();


        // Check empty

        if (!code) {

            alert(
                "Please enter a session code."
            );

            return;
        }


        // Check length

        if (code.length !== 6) {

            alert(
                "Please enter a valid 6-character session code."
            );

            return;
        }


        try {

            setJoining(true);


            console.log(
                "Looking for session:",
                code
            );


            // =================================
            // Find session using join code
            // =================================

            const response =
                await api.get(
                    `/session/join/${code}`
                );


            console.log(
                "Session response:",
                response.data
            );


            const session =
                response.data.data;


            // =================================
            // Check session
            // =================================

            if (!session) {

                alert(
                    "Session not found."
                );

                return;
            }


            // =================================
            // Check if session ended
            // =================================

            if (
                session.status ===
                "Ended"
            ) {

                alert(
                    "This quiz session has already ended."
                );

                return;
            }


            // =================================
            // Session found
            // =================================

            console.log(
                "Session found:",
                session
            );


            // =================================
            // Go to student quiz/session page
            //
            // Participants will be added later.
            // =================================

            navigate(
                `/student/session/${session.session_id}`
            );


        } catch (error) {

            console.error(
                "Failed to join session:",
                error
            );


            if (
                error.response?.status ===
                404
            ) {

                alert(
                    "Invalid session code. Please check the code and try again."
                );

            } else {

                alert(
                    error.response?.data?.message ||
                    "Unable to join the session. Please try again."
                );
            }

        } finally {

            setJoining(false);

        }
    };


    // ================================
    // Render
    // ================================

    return (

        <div className="student-dashboard">


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="student-sidebar">


                {/* Logo */}

                <div className="student-sidebar-logo">

                    <div className="student-logo-mark">
                        Q
                    </div>

                    <span>
                        QuizVerse
                    </span>

                </div>


                {/* Navigation */}

                <nav className="student-sidebar-nav">


                    {/* Dashboard */}

                    <div
                        className="student-nav-item student-active"

                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >

                        <span>
                            ▦
                        </span>

                        Dashboard

                    </div>


                    {/* My Quizzes */}

                    <div
                        className="student-nav-item"

                        onClick={() =>
                            navigate(
                                "/student/quizzes"
                            )
                        }
                    >

                        <span>
                            ☑
                        </span>

                        My Quizzes

                    </div>


                    {/* Live Sessions */}

                    <div
                        className="student-nav-item"

                        onClick={() =>
                            navigate(
                                "/student/live-sessions"
                            )
                        }
                    >

                        <span>
                            ◉
                        </span>

                        Live Sessions

                    </div>


                    {/* AI Generator */}

                    <div
                        className="student-nav-item"

                        onClick={() =>
                            navigate(
                                "/student/ai-generator"
                            )
                        }
                    >

                        <span>
                            ✦
                        </span>

                        AI Generator

                    </div>


                </nav>


                {/* Settings */}

                <div className="student-sidebar-settings">

                    <div
                        className="student-nav-item"

                        onClick={() =>
                            navigate(
                                "/student/settings"
                            )
                        }
                    >

                        <span>
                            ⚙
                        </span>

                        Settings

                    </div>

                </div>


            </aside>


            {/* =================================
                MAIN
            ================================= */}

            <main className="student-main">


                {/* =================================
                    TOP BAR
                ================================= */}

                <header className="student-topbar">


                    {/* Search */}

                    <div className="student-search-box">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search quizzes, topics..."
                        />

                    </div>


                    {/* Profile */}

                    <div className="student-profile">


                        {/* Notification */}

                        <div className="student-notification">

                            ♧

                            <span></span>

                        </div>


                        {/* User information */}

                        <div className="student-profile-info">

                            <strong>

                                {user?.full_name ||
                                    "Student"}

                            </strong>


                            <small>
                                STUDENT VIEW
                            </small>

                        </div>


                        {/* Avatar */}

                        <div className="student-profile-avatar">

                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}

                        </div>


                    </div>


                </header>


                {/* =================================
                    CONTENT
                ================================= */}

                <section className="student-content">


                    {/* =================================
                        JOIN LIVE QUIZ
                    ================================= */}

                    <div className="join-live-section">


                        <div className="join-live-left">


                            <div className="join-live-icon">
                                🚀
                            </div>


                            <div>

                                <h2>
                                    Join Live Quiz
                                </h2>

                                <p>
                                    Enter the 6-digit code provided
                                    by your teacher to jump straight
                                    into the action.
                                </p>

                            </div>


                        </div>


                        <div className="join-live-right">


                            <input
                                type="text"

                                placeholder="E.G. 8X9F2A"

                                value={joinCode}

                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .toUpperCase()
                                            .replace(
                                                /[^A-Z0-9]/g,
                                                ""
                                            )
                                            .slice(
                                                0,
                                                6
                                            );

                                    setJoinCode(
                                        value
                                    );

                                }}

                                maxLength={6}

                                disabled={joining}

                                onKeyDown={(e) => {

                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {

                                        handleJoinSession();

                                    }

                                }}

                            />


                            <button
                                onClick={
                                    handleJoinSession
                                }

                                disabled={
                                    joining
                                }
                            >

                                {joining
                                    ? "Checking..."
                                    : "Enter Session →"}

                            </button>


                        </div>


                    </div>


                    {/* =================================
                        PERFORMANCE
                    ================================= */}

                    <div className="performance-section">


                        <div className="performance-header">

                            <h2>
                                Your Performance
                            </h2>


                            <button>
                                View Full Report ↗
                            </button>

                        </div>


                        <div className="performance-cards">


                            {/* Upcoming */}

                            <div className="performance-card">

                                <div className="performance-icon">
                                    ◫
                                </div>

                                <div className="performance-label">
                                    UPCOMING
                                </div>

                                <div className="performance-value">
                                    3
                                </div>

                                <div className="performance-description">
                                    Quizzes
                                </div>

                            </div>


                            {/* Completed */}

                            <div className="performance-card">

                                <div className="performance-icon">
                                    ▣
                                </div>

                                <div className="performance-label">
                                    COMPLETED
                                </div>

                                <div className="performance-value">
                                    12
                                </div>

                                <div className="performance-description">
                                    this term
                                </div>

                            </div>


                            {/* Average Score */}

                            <div className="performance-card">

                                <div className="performance-icon">
                                    ♒
                                </div>

                                <div className="performance-label">
                                    AVG SCORE
                                </div>

                                <div className="score-circle">
                                    85%
                                </div>

                            </div>


                        </div>

                    </div>


                    {/* =================================
                        RECENT RESULTS
                    ================================= */}

                    <div className="recent-results-section">

                        <h2>
                            Recent Results
                        </h2>


                        {/* Result 1 */}

                        <div className="result-item">

                            <div className="result-icon">
                                ♟
                            </div>

                            <div className="result-info">

                                <strong>
                                    Cellular Biology Fundamentals
                                </strong>

                                <small>
                                    ▣ Oct 12&nbsp;&nbsp;•&nbsp;&nbsp;
                                    24 Questions
                                </small>

                            </div>

                            <div className="result-score">

                                92%

                                <small>
                                    SCORE
                                </small>

                            </div>

                            <button className="result-button">
                                ▣
                            </button>

                        </div>


                        {/* Result 2 */}

                        <div className="result-item">

                            <div className="result-icon">
                                ◩
                            </div>

                            <div className="result-info">

                                <strong>
                                    World War II: European Theater
                                </strong>

                                <small>
                                    ▣ Oct 08&nbsp;&nbsp;•&nbsp;&nbsp;
                                    15 Questions
                                </small>

                            </div>

                            <div className="result-score">

                                78%

                                <small>
                                    SCORE
                                </small>

                            </div>

                            <button className="result-button">
                                ▣
                            </button>

                        </div>


                        {/* Result 3 */}

                        <div className="result-item">

                            <div className="result-icon">
                                ▣
                            </div>

                            <div className="result-info">

                                <strong>
                                    Advanced Algebra: Polynomials
                                </strong>

                                <small>
                                    ▣ Oct 01&nbsp;&nbsp;•&nbsp;&nbsp;
                                    30 Questions
                                </small>

                            </div>

                            <div className="result-score">

                                88%

                                <small>
                                    SCORE
                                </small>

                            </div>

                            <button className="result-button">
                                ▣
                            </button>

                        </div>


                    </div>


                </section>


                {/* =================================
                    FLOATING BUTTON
                ================================= */}

                <button
                    className="student-floating-button"

                    onClick={() =>
                        navigate(
                            "/student/live-sessions"
                        )
                    }
                >

                    +

                </button>


            </main>

        </div>
    );
}


export default StudentDashboard;