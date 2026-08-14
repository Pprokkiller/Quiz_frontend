import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";

import {
    getTeacherQuizzes,
    deleteQuiz
} from "../../services/quizService";

import "./MyQuizzes.css";


function MyQuizzes() {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ==========================================
    // STATE
    // ==========================================

    const [quizzes, setQuizzes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");


    // ==========================================
    // FETCH QUIZZES
    // ==========================================

    const fetchQuizzes = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getTeacherQuizzes();


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
                error.response?.data?.error ||
                "Unable to load quizzes."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        fetchQuizzes();

    }, []);


    // ==========================================
    // DELETE QUIZ
    // ==========================================

    const handleDelete = async (
        quizId,
        quizTitle
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${quizTitle}"?\n\nThis cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(
                quizId
            );


            await deleteQuiz(
                quizId
            );


            // Remove from UI immediately

            setQuizzes(
                currentQuizzes =>
                    currentQuizzes.filter(
                        quiz =>
                            quiz.quiz_id !==
                            quizId
                    )
            );


        } catch (error) {

            console.error(
                "Failed to delete quiz:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete quiz."
            );

        } finally {

            setDeletingId(null);

        }

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredQuizzes =
        quizzes.filter(
            quiz => {

                const search =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!search) {
                    return true;
                }


                const title =
                    quiz.title
                        ?.toLowerCase() || "";


                const subject =
                    quiz.subject
                        ?.toLowerCase() || "";


                const difficulty =
                    quiz.difficulty
                        ?.toLowerCase() || "";


                return (
                    title.includes(search) ||
                    subject.includes(search) ||
                    difficulty.includes(search)
                );

            }
        );


    // ==========================================
    // LOADING
    // ==========================================

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

                        <div className="page-header">

                            <div>

                                <h1>
                                    My Quizzes
                                </h1>

                                <p>
                                    Loading your quizzes...
                                </p>

                            </div>

                        </div>


                        <div className="empty-state">

                            <div className="empty-icon">
                                ✦
                            </div>

                            <h2>
                                Loading quizzes...
                            </h2>

                            <p>
                                Please wait while we load your quizzes.
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // MAIN
    // ==========================================

    return (

        <div className="teacher-dashboard">


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="sidebar">


                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="logo-mark">
                        Q
                    </div>

                    <span>
                        QuizVerse
                    </span>

                </div>


                {/* NAVIGATION */}

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
                        onClick={() =>
                            navigate(
                                "/teacher/quizzes"
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


                {/* SETTINGS */}

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


            {/* =================================
                MAIN
            ================================= */}

            <main className="dashboard-main">


                {/* =================================
                    TOP BAR
                ================================= */}

                <header className="topbar">


                    {/* SEARCH */}

                    <div className="search-box">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search quizzes, topics..."
                            value={searchTerm}
                            onChange={
                                event =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                            }
                        />

                    </div>


                    {/* PROFILE */}

                    <div className="teacher-profile">


                        <div className="notification">

                            ♧

                            <span></span>

                        </div>


                        <div className="profile-info">

                            <strong>
                                {
                                    user?.full_name ||
                                    "Teacher"
                                }
                            </strong>

                            <small>
                                TEACHER VIEW
                            </small>

                        </div>


                        <div className="profile-avatar">

                            {
                                user?.full_name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                "T"
                            }

                        </div>

                    </div>

                </header>


                {/* =================================
                    PAGE CONTENT
                ================================= */}

                <section className="my-quizzes-content">


                    {/* PAGE HEADER */}

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


                    {/* =================================
                        ERROR
                    ================================= */}

                    {error && (

                        <div className="error-message">

                            {error}


                            <button
                                onClick={
                                    fetchQuizzes
                                }
                            >
                                Retry
                            </button>

                        </div>

                    )}


                    {/* =================================
                        EMPTY STATE
                    ================================= */}

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


                    {/* =================================
                        NO SEARCH RESULTS
                    ================================= */}

                    {!error &&
                        quizzes.length > 0 &&
                        filteredQuizzes.length === 0 && (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ⌕
                                </div>

                                <h2>
                                    No quizzes found
                                </h2>

                                <p>
                                    Try searching for another title or subject.
                                </p>

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                >
                                    Clear Search
                                </button>

                            </div>

                        )}


                    {/* =================================
                        QUIZ GRID
                    ================================= */}

                    {!error &&
                        filteredQuizzes.length > 0 && (

                            <div className="quiz-grid">


                                {filteredQuizzes.map(
                                    quiz => (

                                        <div
                                            className="quiz-card"
                                            key={
                                                quiz.quiz_id
                                            }
                                        >


                                            {/* =========================
                                                CARD HEADER
                                            ========================= */}

                                            <div className="quiz-card-header">


                                                <div className="quiz-icon">
                                                    ✦
                                                </div>


                                                <span
                                                    className={`quiz-status ${
                                                        quiz.quiz_type
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            ) ||
                                                        "quiz"
                                                    }`}
                                                >

                                                    {
                                                        quiz.quiz_type ||
                                                        "Quiz"
                                                    }

                                                </span>

                                            </div>


                                            {/* =========================
                                                CARD BODY
                                            ========================= */}

                                            <div className="quiz-card-body">


                                                <h2>

                                                    {
                                                        quiz.title ||
                                                        "Untitled Quiz"
                                                    }

                                                </h2>


                                                <p className="quiz-subject">

                                                    {
                                                        quiz.subject ||
                                                        "No subject"
                                                    }

                                                </p>


                                                <div className="quiz-details">


                                                    <span>

                                                        {
                                                            quiz.question_count ||
                                                            0
                                                        }

                                                        {" "}

                                                        Questions

                                                    </span>


                                                    <span>

                                                        {
                                                            quiz.total_marks ||
                                                            0
                                                        }

                                                        {" "}

                                                        Points

                                                    </span>


                                                    <span>

                                                        {
                                                            quiz.difficulty ||
                                                            "Not specified"
                                                        }

                                                    </span>

                                                </div>

                                            </div>


                                            {/* =========================
                                                CARD FOOTER
                                            ========================= */}

                                            <div className="quiz-card-footer">


                                                {/* EDIT */}

                                                <button
                                                    className="secondary-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/teacher/quizzes/${quiz.quiz_id}/edit`
                                                        )
                                                    }
                                                >

                                                    Edit

                                                </button>


                                                {/* OPEN */}

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


                                                {/* DELETE */}

                                                <button
                                                    className="delete-button"
                                                    disabled={
                                                        deletingId ===
                                                        quiz.quiz_id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            quiz.quiz_id,
                                                            quiz.title ||
                                                            "Untitled Quiz"
                                                        )
                                                    }
                                                >

                                                    {
                                                        deletingId ===
                                                        quiz.quiz_id
                                                            ? "Deleting..."
                                                            : "Delete"
                                                    }

                                                </button>

                                            </div>


                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </section>

            </main>

        </div>

    );

}


export default MyQuizzes;