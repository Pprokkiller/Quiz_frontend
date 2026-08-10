import "./MyQuizzes.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function MyQuizzes() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Temporary quiz data
    // We will replace this with data from the backend later.
    const quizzes = [
        {
            id: 1,
            title: "World History",
            subject: "History",
            questions: 10,
            points: 10,
            difficulty: "Medium",
            status: "Published",
        },
        {
            id: 2,
            title: "Cellular Biology Fundamentals",
            subject: "Biology",
            questions: 24,
            points: 24,
            difficulty: "Easy",
            status: "Published",
        },
        {
            id: 3,
            title: "Advanced Algebra",
            subject: "Mathematics",
            questions: 30,
            points: 30,
            difficulty: "Hard",
            status: "Draft",
        },
    ];

    return (
        <div className="teacher-dashboard">

            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="logo-mark">Q</div>
                    <span>QuizVerse</span>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">

                    <div
                        className="nav-item"
                        onClick={() => navigate("/teacher/dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </div>

                    <div className="nav-item active">
                        <span>☑</span>
                        My Quizzes
                    </div>

                    <div
                        className="nav-item"
                        onClick={() => navigate("/teacher/live-sessions")}
                    >
                        <span>◉</span>
                        Live Sessions
                    </div>

                    <div
                        className="nav-item"
                        onClick={() => navigate("/teacher/ai-generator")}
                    >
                        <span>✦</span>
                        AI Generator
                    </div>

                </nav>

                {/* Settings */}
                <div className="sidebar-settings">

                    <div
                        className="nav-item"
                        onClick={() => navigate("/teacher/settings")}
                    >
                        <span>⚙</span>
                        Settings
                    </div>

                </div>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="dashboard-main">

                {/* Top Bar */}
                <header className="topbar">

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search quizzes, topics..."
                        />

                    </div>


                    <div className="teacher-profile">

                        {/* Notification */}
                        <div className="notification">
                            ♧
                            <span></span>
                        </div>


                        {/* User Information */}
                        <div className="profile-info">

                            <strong>
                                {user?.full_name || "Teacher"}
                            </strong>

                            <small>
                                TEACHER VIEW
                            </small>

                        </div>


                        {/* Avatar */}
                        <div className="profile-avatar">

                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "T"}

                        </div>

                    </div>

                </header>


                {/* ================= PAGE CONTENT ================= */}

                <section className="my-quizzes-content">

                    {/* Page Header */}

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
                                navigate("/teacher/quizzes/create")
                            }
                        >
                            <span>+</span>
                            Create Quiz
                        </button>

                    </div>


                    {/* ================= QUIZ LIST ================= */}

                    {quizzes.length === 0 ? (

                        /* Empty State */

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

                    ) : (

                        <div className="quiz-grid">

                            {quizzes.map((quiz) => (

                                <div
                                    className="quiz-card"
                                    key={quiz.id}
                                >

                                    {/* Card Header */}

                                    <div className="quiz-card-header">

                                        <div className="quiz-icon">
                                            ✦
                                        </div>

                                        <span
                                            className={`quiz-status ${
                                                quiz.status
                                                    .toLowerCase()
                                            }`}
                                        >
                                            {quiz.status}
                                        </span>

                                    </div>


                                    {/* Quiz Information */}

                                    <div className="quiz-card-body">

                                        <h2>
                                            {quiz.title}
                                        </h2>

                                        <p className="quiz-subject">
                                            {quiz.subject}
                                        </p>


                                        <div className="quiz-details">

                                            <span>
                                                {quiz.questions} Questions
                                            </span>

                                            <span>
                                                {quiz.points} Points
                                            </span>

                                            <span>
                                                {quiz.difficulty}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Card Footer */}

                                    <div className="quiz-card-footer">

                                        <button
                                            className="secondary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/teacher/quizzes/${quiz.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="primary-button"
                                            onClick={() =>
                                                navigate(
                                                    `/teacher/quizzes/${quiz.id}`
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