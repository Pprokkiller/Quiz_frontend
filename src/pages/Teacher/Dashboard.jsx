import "./Dashboard.css";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="teacher-dashboard">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="logo-mark">Q</div>
                    <span>QuizVerse</span>
                </div>

                <nav className="sidebar-nav">

                    {/* Dashboard */}
                    <button
                        className="nav-item active"
                        onClick={() => navigate("/teacher/dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    {/* My Quizzes */}
                    <button
                        className="nav-item"
                        onClick={() => navigate("/teacher/quizzes")}
                    >
                        <span>☑</span>
                        My Quizzes
                    </button>

                    {/* Live Sessions */}
                    <button
                        className="nav-item"
                        onClick={() => navigate("/teacher/live")}
                    >
                        <span>◉</span>
                        Live Sessions
                    </button>

                    {/* AI Generator */}
                    <button
                        className="nav-item"
                        onClick={() => navigate("/teacher/ai-generator")}
                    >
                        <span>✦</span>
                        AI Generator
                    </button>

                </nav>

                {/* Settings */}
                <div className="sidebar-settings">
                    <button
                        className="nav-item"
                        onClick={() => navigate("/teacher/settings")}
                    >
                        <span>⚙</span>
                        Settings
                    </button>
                </div>

            </aside>


            {/* Main Content */}
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

                        <div className="notification">
                            ♧
                            <span></span>
                        </div>

                        <div className="profile-info">
                            <strong>
                                {user?.full_name || "Teacher"}
                            </strong>

                            <small>TEACHER VIEW</small>
                        </div>

                        <div className="profile-avatar">
                            {user?.full_name?.charAt(0) || "T"}
                        </div>

                    </div>

                </header>


                {/* Dashboard Content */}
                <section className="dashboard-content">

                    {/* Action Cards */}
                    <div className="action-grid">

                        {/* Create Quiz */}
                        <button
                            className="action-card"
                            onClick={() => navigate("/teacher/quizzes/create")}
                        >
                            <div className="action-icon">
                                ✦
                            </div>

                            <div>
                                <h2>Create Quiz</h2>
                                <p>AI-powered generation</p>
                            </div>
                        </button>


                        {/* Live Session */}
                        <button
                            className="action-card"
                            onClick={() => navigate("/teacher/live")}
                        >
                            <div className="action-icon purple">
                                ◉
                            </div>

                            <div>
                                <h2>Live Session</h2>
                                <p>Real-time assessment</p>
                            </div>
                        </button>

                    </div>


                    {/* Statistics */}
                    <div className="stats-grid">

                        <div className="stat-card">
                            <span>QUIZZES</span>
                            <strong>24</strong>
                        </div>

                        <div className="stat-card">
                            <span>ACTIVE</span>
                            <strong>2</strong>
                        </div>

                        <div className="stat-card">
                            <span>STUDENTS</span>
                            <strong>156</strong>
                        </div>

                        <div className="stat-card">
                            <span>AVG SCORE</span>
                            <strong>78%</strong>
                        </div>

                    </div>


                    {/* Activity Section */}
                    <div className="activity-grid">

                        <div className="activity-card">

                            <h3>Weekly Activity</h3>

                            <div className="chart">

                                <div className="chart-line">
                                    ╭────╮
                                    <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╰────╮
                                    <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;╰────╮
                                </div>

                            </div>

                            <div className="chart-labels">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                                <span>Sun</span>
                            </div>

                        </div>


                        {/* Recent */}
                        <div className="recent-card">

                            <h3>Recent</h3>

                            <div className="recent-item">
                                <div>
                                    <strong>Sarah Jenkins</strong>
                                    <small>Algorithms Quiz</small>
                                </div>

                                <b>92%</b>
                            </div>

                            <div className="recent-item">
                                <div>
                                    <strong>Marcus Chen</strong>
                                    <small>Midterm Review</small>
                                </div>

                                <b className="live">Live</b>
                            </div>

                            <div className="recent-item">
                                <div>
                                    <strong>Elena Rodriguez</strong>
                                    <small>Biology Basics</small>
                                </div>

                                <b className="low">65%</b>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;