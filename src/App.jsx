import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";

import Dashboard from "./pages/Teacher/Dashboard";
import MyQuizzes from "./pages/Teacher/MyQuizzes";
import CreateQuiz from "./pages/Teacher/CreateQuiz";
import LiveSession from "./pages/Teacher/LiveSession";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentSession from "./pages/Student/StudentSession";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Teacher Dashboard */}
                <Route
                    path="/teacher/dashboard"
                    element={<Dashboard />}
                />

                {/* My Quizzes */}
                <Route
                    path="/teacher/quizzes"
                    element={<MyQuizzes />}
                />

                {/* Create Quiz */}
                <Route
                    path="/teacher/quizzes/create"
                    element={<CreateQuiz />}
                />

                {/* Default */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Invalid URL */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
                <Route
                    path="/teacher/live-session"
                    element={<LiveSession />}
                />

                <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                />
                <Route
                    path="/student/session/:sessionId"
                    element={<StudentSession />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;