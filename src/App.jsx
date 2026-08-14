import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


// ==============================
// AUTH
// ==============================

import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";


// ==============================
// TEACHER
// ==============================

import Dashboard from "./pages/Teacher/Dashboard";
import MyQuizzes from "./pages/Teacher/MyQuizzes";
import CreateQuiz from "./pages/Teacher/CreateQuiz";
import LiveSession from "./pages/Teacher/LiveSession";


// ==============================
// STUDENT
// ==============================

import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentSession from "./pages/Student/StudentSession";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================
                    AUTH
                ================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================
                    TEACHER DASHBOARD
                ================================= */}

                <Route
                    path="/teacher/dashboard"
                    element={<Dashboard />}
                />


                {/* =================================
                    TEACHER QUIZZES
                ================================= */}

                {/* My Quizzes */}

                <Route
                    path="/teacher/quizzes"
                    element={<MyQuizzes />}
                />


                {/* Create New Quiz */}

                <Route
                    path="/teacher/quizzes/create"
                    element={<CreateQuiz />}
                />


                {/* Edit Existing Quiz */}

                <Route
                    path="/teacher/quizzes/:quizId/edit"
                    element={<CreateQuiz />}
                />


                {/* =================================
                    TEACHER LIVE SESSION
                ================================= */}

                <Route
                    path="/teacher/live-session"
                    element={<LiveSession />}
                />


                {/* =================================
                    STUDENT DASHBOARD
                ================================= */}

                <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                />


                {/* =================================
                    STUDENT SESSION
                ================================= */}

                <Route
                    path="/student/session/:sessionId"
                    element={<StudentSession />}
                />


                {/* =================================
                    DEFAULT
                ================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =================================
                    INVALID URL
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;