import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/authContext";
import {getStudentDashboard} from "../../services/studentService";
import "./StudentDashboard.css";


function StudentDashboard() {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ==========================================
    // JOIN SESSION CODE
    // ==========================================

    const [joinCode, setJoinCode] = useState("");


    // ==========================================
    // DASHBOARD DATA
    // ==========================================

    const [dashboardData, setDashboardData] = useState({

        completed: 0,

        avgScore: 0,

        upcoming: [],

        recentResults: []

    });


    // ==========================================
    // LOADING + ERROR
    // ==========================================

    const [loading, setLoading] = useState(true);

    const [dashboardError, setDashboardError] = useState("");


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);

                setDashboardError("");


                const response =
                    await getStudentDashboard();


                console.log(
                    "Student dashboard data:",
                    response
                );


                if (response.success) {

                    setDashboardData(
                        response.data
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load student dashboard:",
                    error
                );


                setDashboardError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    // ==========================================
    // JOIN LIVE SESSION
    // ==========================================

    const handleJoinSession = () => {

        const code =
            joinCode.trim().toUpperCase();


        if (!code) {

            alert(
                "Please enter a session code."
            );

            return;

        }


        console.log(
            "Joining session:",
            code
        );


        // We will connect this to the
        // actual session page later.

        navigate(
            `/student/session/${code}`
        );

    };


    // ==========================================
    // LOGGED-IN STUDENT NAME
    // ==========================================

    const studentName =
        user?.full_name || "Student";


    const studentInitial =
        studentName
            ?.charAt(0)
            ?.toUpperCase() || "S";


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="student-dashboard">


            {/* =====================================
                SIDEBAR
            ====================================== */}

            <aside className="student-sidebar">


                {/* LOGO */}

                <div className="student-sidebar-logo">

                    <div className="student-logo-mark">
                        Q
                    </div>


                    <span>
                        QuizVerse
                    </span>

                </div>


                {/* NAVIGATION */}

                <nav className="student-sidebar-nav">


                    {/* DASHBOARD */}

                    <div
                        className="
                            student-nav-item
                            student-active
                        "
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


                    {/* MY QUIZZES */}

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


                    {/* LIVE SESSIONS */}

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


                    {/* AI GENERATOR */}

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


                {/* SETTINGS */}

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


            {/* =====================================
                MAIN
            ====================================== */}

            <main className="student-main">


                {/* =================================
                    TOP BAR
                ================================== */}

                <header className="student-topbar">


                    {/* SEARCH */}

                    <div className="student-search-box">

                        <span>
                            ⌕
                        </span>


                        <input
                            type="text"
                            placeholder="
                                Search quizzes, topics...
                            "
                        />

                    </div>


                    {/* PROFILE */}

                    <div className="student-profile">


                        {/* NOTIFICATION */}

                        <div className="student-notification">

                            ♧

                            <span></span>

                        </div>


                        {/* STUDENT INFORMATION */}

                        <div className="student-profile-info">

                            <strong>
                                {studentName}
                            </strong>


                            <small>
                                STUDENT VIEW
                            </small>

                        </div>


                        {/* AVATAR */}

                        <div className="student-profile-avatar">

                            {studentInitial}

                        </div>


                    </div>


                </header>


                {/* =================================
                    CONTENT
                ================================== */}

                <section className="student-content">


                    {/* =================================
                        JOIN LIVE QUIZ
                    ================================== */}

                    <div className="join-live-section">


                        {/* LEFT SIDE */}

                        <div className="join-live-left">


                            <div className="join-live-icon">
                                🚀
                            </div>


                            <div>

                                <h2>
                                    Join Live Quiz
                                </h2>


                                <p>
                                    Enter the 6-digit code
                                    provided by your teacher
                                    to jump straight into
                                    the action.
                                </p>

                            </div>


                        </div>


                        {/* RIGHT SIDE */}

                        <div className="join-live-right">


                            <input
                                type="text"
                                placeholder="E.G. 8X9F2A"
                                value={joinCode}
                                onChange={(e) =>
                                    setJoinCode(
                                        e.target.value
                                            .toUpperCase()
                                    )
                                }
                                maxLength={6}
                            />


                            <button
                                onClick={
                                    handleJoinSession
                                }
                            >
                                Enter Session →
                            </button>


                        </div>


                    </div>


                    {/* =================================
                        ERROR
                    ================================== */}

                    {dashboardError && (

                        <div className="dashboard-error">

                            {dashboardError}

                        </div>

                    )}


                    {/* =================================
                        PERFORMANCE
                    ================================== */}

                    <div className="performance-section">


                        {/* PERFORMANCE HEADER */}

                        <div className="performance-header">

                            <h2>
                                Your Performance
                            </h2>


                            <button
                                onClick={() =>
                                    console.log(
                                        "Full report clicked"
                                    )
                                }
                            >
                                View Full Report ↗
                            </button>


                        </div>


                        {/* PERFORMANCE CARDS */}

                        <div className="performance-cards">


                            {/* ==========================
                                UPCOMING
                            =========================== */}

                            <div className="performance-card">


                                <div className="performance-icon">
                                    ◫
                                </div>


                                <div className="performance-label">
                                    UPCOMING
                                </div>


                                <div className="performance-value">

                                    {loading

                                        ? "..."

                                        : dashboardData
                                            .upcoming
                                            .length

                                    }

                                </div>


                                <div className="performance-description">
                                    Quizzes
                                </div>


                            </div>


                            {/* ==========================
                                COMPLETED
                            =========================== */}

                            <div className="performance-card">


                                <div className="performance-icon">
                                    ▣
                                </div>


                                <div className="performance-label">
                                    COMPLETED
                                </div>


                                <div className="performance-value">

                                    {loading

                                        ? "..."

                                        : dashboardData
                                            .completed

                                    }

                                </div>


                                <div className="performance-description">
                                    this term
                                </div>


                            </div>


                            {/* ==========================
                                AVG SCORE
                            =========================== */}

                            <div className="performance-card">


                                <div className="performance-icon">
                                    ♒
                                </div>


                                <div className="performance-label">
                                    AVG SCORE
                                </div>


                                <div className="score-circle">

                                    {loading

                                        ? "..."

                                        : `${Math.round(
                                            Number(
                                                dashboardData
                                                    .avgScore
                                            )
                                        )}%`

                                    }

                                </div>


                            </div>


                        </div>


                    </div>


                    {/* =================================
                        RECENT RESULTS
                    ================================== */}

                    <div className="recent-results-section">


                        <h2>
                            Recent Results
                        </h2>


                        {/* LOADING */}

                        {loading && (

                            <div className="empty-results">

                                Loading results...

                            </div>

                        )}


                        {/* NO RESULTS */}

                        {!loading &&
                            dashboardData
                                .recentResults
                                .length === 0 && (

                                <div className="empty-results">

                                    No quiz results yet.

                                </div>

                            )
                        }


                        {/* RESULTS */}

                        {!loading &&
                            dashboardData
                                .recentResults
                                .length > 0 && (

                                dashboardData
                                    .recentResults
                                    .map(
                                        (result) => (

                                            <div
                                                className="
                                                    result-item
                                                "
                                                key={
                                                    result.result_id
                                                }
                                            >


                                                {/* ICON */}

                                                <div
                                                    className="
                                                        result-icon
                                                    "
                                                >
                                                    ▣
                                                </div>


                                                {/* QUIZ INFORMATION */}

                                                <div
                                                    className="
                                                        result-info
                                                    "
                                                >

                                                    <strong>
                                                        {
                                                            result.title
                                                        }
                                                    </strong>


                                                    <small>

                                                        {
                                                            result.subject ||
                                                            "Quiz"
                                                        }

                                                        &nbsp;&nbsp;
                                                        •
                                                        &nbsp;&nbsp;

                                                        {
                                                            result.total_marks ||
                                                            0
                                                        }

                                                        {" "}
                                                        Questions

                                                    </small>

                                                </div>


                                                {/* SCORE */}

                                                <div
                                                    className="
                                                        result-score
                                                    "
                                                >

                                                    {
                                                        Math.round(
                                                            Number(
                                                                result
                                                                    .percentage
                                                            )
                                                        )
                                                    }%

                                                    <small>
                                                        SCORE
                                                    </small>

                                                </div>


                                                {/* RESULT BUTTON */}

                                                <button
                                                    className="
                                                        result-button
                                                    "
                                                    onClick={() =>
                                                        console.log(
                                                            "Result ID:",
                                                            result
                                                                .result_id
                                                        )
                                                    }
                                                >
                                                    ▣
                                                </button>


                                            </div>

                                        )
                                    )

                            )
                        }


                    </div>


                </section>


                {/* =====================================
                    FLOATING BUTTON
                ====================================== */}

                <button
                    className="
                        student-floating-button
                    "
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