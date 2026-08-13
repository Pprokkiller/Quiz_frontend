import { useEffect, useState } from "react";
import "./MyQuizzes.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import { getTeacherQuizzes } from "../../services/quizService";


function MyQuizzes() {

    const navigate = useNavigate();

    const { user } = useAuth();


    // =============================
    // STATE
    // =============================

    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =============================
    // GET QUIZZES
    // =============================

    const fetchQuizzes = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await getTeacherQuizzes();


            console.log(
                "Teacher quizzes:",
                response
            );


            setQuizzes(
                response.data || []
            );


        } catch (error) {

            console.error(
                "Failed to fetch quizzes:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to load quizzes."
            );


        } finally {

            setLoading(false);

        }
    };


    // =============================
    // LOAD QUIZZES WHEN PAGE OPENS
    // =============================

    useEffect(() => {

        fetchQuizzes();

    }, []);


    // =============================
    // LOADING
    // =============================

    if (loading) {

        return (

            <div className="teacher-dashboard">

                <aside className="sidebar">

                    <div className="sidebar-logo">

                        <div className="logo-mark">
                            Q
                        </div>

                        <span>
                            QuizVerse
                        </span>

                    </div>

                </aside>


                <main className="dashboard-main">

                    <div className="my-quizzes-content">

                        <h2>
                            Loading quizzes...
                        </h2>

                    </div>

                </main>

            </div>

        );
    }


    // =============================
    // MAIN PAGE
    // =============================

    return (

        <div className="teacher-dashboard">


            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">


                {/* Logo */}

                <div className="sidebar-logo">

                    <div className="logo-mark">
                        Q
                    </div>

                    <span>
                        QuizVerse
                    </span>

                </div>


                {/* Navigation */}

                <nav className="sidebar-nav">


                    {/* Dashboard */}

                    <div
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/teacher/dashboard"
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
                        className="nav-item active"
                    >

                        <span>
                            ☑
                        </span>

                        My Quizzes

                    </div>


                    {/* Live Sessions */}

                    <div
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/teacher/live-sessions"
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
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/teacher/ai-generator"
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

                <div className="sidebar-settings">

                    <div
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/teacher/settings"
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


            {/* ================= MAIN ================= */}

            <main className="dashboard-main">


                {/* ================= TOP BAR ================= */}

                <header className="topbar">


                    {/* Search */}

                    <div className="search-box">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search quizzes, topics..."
                        />

                    </div>


                    {/* Teacher Profile */}

                    <div className="teacher-profile">


                        {/* Notification */}

                        <div className="notification">

                            ♧

                            <span></span>

                        </div>


                        {/* User Information */}

                        <div className="profile-info">

                            <strong>

                                {user?.full_name ||
                                    "Teacher"}

                            </strong>


                            <small>

                                TEACHER VIEW

                            </small>

                        </div>


                        {/* Avatar */}

                        <div className="profile-avatar">

                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "T"}

                        </div>


                    </div>


                </header>


                {/* ================= PAGE CONTENT ================= */}

                <section className="my-quizzes-content">


                    {/* ================= PAGE HEADER ================= */}

                    <div className="page-header">


                        <div>

                            <h1>
                                My Quizzes
                            </h1>

                            <p>
                                Create, manage and track your quizzes.
                            </p>

                        </div>


                        <button
                            className="create-quiz-button"
                            onClick={() =>
                                navigate(
                                    "/teacher/quizzes/create"
                                )
                            }
                        >

                            <span>
                                +
                            </span>

                            Create Quiz

                        </button>


                    </div>


                    {/* ================= ERROR ================= */}

                    {error && (

                        <div className="error-message">

                            {error}

                        </div>

                    )}


                    {/* ================= NO QUIZZES ================= */}

                    {!error &&
                        quizzes.length === 0 && (

                            <div className="empty-state">


                                <div className="empty-icon">
                                    ✦
                                </div>


                                <h2>
                                    No quizzes yet
                                </h2>


                                <p>
                                    Create your first quiz to get started.
                                </p>


                                <button
                                    className="create-quiz-button"
                                    onClick={() =>
                                        navigate(
                                            "/teacher/quizzes/create"
                                        )
                                    }
                                >
                                    Create Your First Quiz
                                </button>


                            </div>

                        )}


                    {/* ================= QUIZ LIST ================= */}

                    {!error &&
                        quizzes.length > 0 && (

                            <div className="quiz-grid">


                                {quizzes.map((quiz) => (

                                    <div
                                        className="quiz-card"
                                        key={quiz.quiz_id}
                                    >


                                        {/* ================= CARD HEADER ================= */}

                                        <div className="quiz-card-header">


                                            <div className="quiz-icon">
                                                ✦
                                            </div>


                                            {/* Quiz Type */}

                                            <span
                                                className={`quiz-status ${
                                                    quiz.quiz_type
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )
                                                }`}
                                            >

                                                {quiz.quiz_type ||
                                                    "Quiz"}

                                            </span>


                                        </div>


                                        {/* ================= CARD BODY ================= */}

                                        <div className="quiz-card-body">


                                            {/* Title */}

                                            <h2>

                                                {quiz.title ||
                                                    "Untitled Quiz"}

                                            </h2>


                                            {/* Subject */}

                                            <p className="quiz-subject">

                                                {quiz.subject ||
                                                    "No subject"}

                                            </p>


                                            {/* Details */}

                                            <div className="quiz-details">


                                                <span>

                                                    {quiz.question_count ||
                                                        0}

                                                    {" "}
                                                    Questions

                                                </span>


                                                <span>

                                                    {quiz.total_marks ||
                                                        0}

                                                    {" "}
                                                    Points

                                                </span>


                                                <span>

                                                    {quiz.difficulty ||
                                                        "Not specified"}

                                                </span>


                                            </div>


                                        </div>


                                        {/* ================= CARD FOOTER ================= */}

                                        <div className="quiz-card-footer">


                                            {/* Edit */}

                                            <button
                                                className="secondary-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/quizzes/${quiz.quiz_id}`
                                                    )
                                                }
                                            >

                                                Edit

                                            </button>


                                            {/* Open Quiz */}

                                            <button
                                                className="primary-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/quizzes/${quiz.quiz_id}`
                                                    )
                                                }
                                            >

                                                Open Quiz

                                            </button>


                                        </div>


                                    </div>

                                ))}


                            </div>

                        )}


                </section>


            </main>


        </div>

    );
}


export default MyQuizzes;