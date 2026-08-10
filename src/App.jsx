import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Auth/login";
import Dashboard from "./pages/Teacher/Dashboard";
import MyQuizzes from "./pages/Teacher/MyQuizzes";
import CreateQuiz from "./pages/Teacher/CreateQuiz";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/teacher/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/teacher/quizzes"
                    element={<MyQuizzes />}
                />

                <Route
                    path="/teacher/quizzes/create"
                    element={<CreateQuiz />}
                />

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