import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import { createQuiz } from "../../services/quizService";
import { createQuestion } from "../../services/questionService";
import { createOption } from "../../services/optionService";
import api from "../../services/api";

import "./CreateQuiz.css";


function CreateQuiz() {

    const navigate = useNavigate();
    const { user } = useAuth();


    // =========================
    // Quiz Information
    // =========================

    const [quizTitle, setQuizTitle] =
        useState("Untitled Quiz");

    const [subject, setSubject] =
        useState("History");

    const [difficulty, setDifficulty] =
        useState("Medium");

    const [totalMarks, setTotalMarks] =
        useState(10);

    const [description, setDescription] =
        useState("");


    // =========================
    // Quiz Settings
    // =========================

    const [shuffleQuestions, setShuffleQuestions] =
        useState(false);

    const [showFeedback, setShowFeedback] =
        useState(true);


    // =========================
    // Publishing
    // =========================

    const [publishing, setPublishing] =
        useState(false);


    // =========================
    // Questions
    // =========================

    const [questions, setQuestions] = useState([
        {
            id: 1,

            text: "",

            type: "MCQ",

            points: 1,

            options: [
                {
                    id: 1,
                    text: "",
                    correct: true
                },

                {
                    id: 2,
                    text: "",
                    correct: false
                },

                {
                    id: 3,
                    text: "",
                    correct: false
                },

                {
                    id: 4,
                    text: "",
                    correct: false
                }
            ]
        }
    ]);


    // =========================
    // Update Question
    // =========================

    const updateQuestion = (
        questionId,
        value
    ) => {

        setQuestions(
            (currentQuestions) =>

                currentQuestions.map(
                    (question) =>

                        question.id === questionId
                            ? {
                                ...question,
                                text: value
                            }
                            : question
                )
        );
    };


    // =========================
    // Update Option
    // =========================

    const updateOption = (
        questionId,
        optionId,
        value
    ) => {

        setQuestions(
            (currentQuestions) =>

                currentQuestions.map(
                    (question) => {

                        if (
                            question.id !== questionId
                        ) {
                            return question;
                        }


                        return {
                            ...question,

                            options:
                                question.options.map(
                                    (option) =>

                                        option.id === optionId
                                            ? {
                                                ...option,
                                                text: value
                                            }
                                            : option
                                )
                        };
                    }
                )
        );
    };


    // =========================
    // Select Correct Option
    // =========================

    const selectCorrectOption = (
        questionId,
        optionId
    ) => {

        setQuestions(
            (currentQuestions) =>

                currentQuestions.map(
                    (question) => {

                        if (
                            question.id !== questionId
                        ) {
                            return question;
                        }


                        return {
                            ...question,

                            options:
                                question.options.map(
                                    (option) => ({
                                        ...option,

                                        correct:
                                            option.id === optionId
                                    })
                                )
                        };
                    }
                )
        );
    };


    // =========================
    // Add Option
    // =========================

    const addOption = (questionId) => {

        setQuestions(
            (currentQuestions) =>

                currentQuestions.map(
                    (question) => {

                        if (
                            question.id !== questionId
                        ) {
                            return question;
                        }


                        return {
                            ...question,

                            options: [
                                ...question.options,

                                {
                                    id: Date.now(),

                                    text: "",

                                    correct: false
                                }
                            ]
                        };
                    }
                )
        );
    };


    // =========================
    // Remove Option
    // =========================

    const removeOption = (
        questionId,
        optionId
    ) => {

        setQuestions(
            (currentQuestions) =>

                currentQuestions.map(
                    (question) => {

                        if (
                            question.id !== questionId
                        ) {
                            return question;
                        }


                        // Keep at least 2 options

                        if (
                            question.options.length <= 2
                        ) {
                            return question;
                        }


                        return {
                            ...question,

                            options:
                                question.options.filter(
                                    (option) =>
                                        option.id !== optionId
                                )
                        };
                    }
                )
        );
    };


    // =========================
    // Add Question
    // =========================

    const addQuestion = () => {

        const id = Date.now();


        const newQuestion = {

            id,

            text: "",

            // Database accepts:
            // MCQ / TrueFalse

            type: "MCQ",

            points: 1,

            options: [

                {
                    id: id + 1,

                    text: "",

                    correct: true
                },

                {
                    id: id + 2,

                    text: "",

                    correct: false
                },

                {
                    id: id + 3,

                    text: "",

                    correct: false
                },

                {
                    id: id + 4,

                    text: "",

                    correct: false
                }
            ]
        };


        setQuestions(
            (currentQuestions) => [
                ...currentQuestions,
                newQuestion
            ]
        );
    };


    // =========================
    // Remove Question
    // =========================

    const removeQuestion = (
        questionId
    ) => {

        if (questions.length <= 1) {
            return;
        }


        setQuestions(
            (currentQuestions) =>

                currentQuestions.filter(
                    (question) =>
                        question.id !== questionId
                )
        );
    };


    // =========================
    // Publish Quiz
    // =========================

    const handlePublish = async () => {

        if (publishing) {
            return;
        }


        // =========================
        // Validate Quiz
        // =========================

        if (!quizTitle.trim()) {

            alert(
                "Please enter a quiz title."
            );

            return;
        }


        if (!subject.trim()) {

            alert(
                "Please enter a subject."
            );

            return;
        }


        if (questions.length === 0) {

            alert(
                "Please add at least one question."
            );

            return;
        }


        // =========================
        // Validate Questions
        // =========================

        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const question =
                questions[i];


            if (!question.text.trim()) {

                alert(
                    `Please enter Question ${
                        i + 1
                    }.`
                );

                return;
            }


            if (
                !question.options ||
                question.options.length < 2
            ) {

                alert(
                    `Question ${
                        i + 1
                    } must have at least 2 options.`
                );

                return;
            }


            for (
                let j = 0;
                j < question.options.length;
                j++
            ) {

                if (
                    !question.options[j].text.trim()
                ) {

                    alert(
                        `Please fill in Option ${
                            String.fromCharCode(
                                65 + j
                            )
                        } for Question ${
                            i + 1
                        }.`
                    );

                    return;
                }
            }


            const hasCorrectAnswer =
                question.options.some(
                    (option) =>
                        option.correct === true
                );


            if (!hasCorrectAnswer) {

                alert(
                    `Please select a correct answer for Question ${
                        i + 1
                    }.`
                );

                return;
            }
        }


        // =========================
        // Start Publishing
        // =========================

        try {

            setPublishing(true);


            console.log(
                "Creating quiz..."
            );


            // =================================
            // STEP 1
            // CREATE QUIZ
            // =================================

            const quizResponse =
                await createQuiz({

                    title:
                        quizTitle.trim(),

                    description:
                        description.trim(),

                    subject:
                        subject.trim(),

                    difficulty,

                    quiz_type:
                        "Practice",

                    total_marks:
                        Number(totalMarks)

                });


            console.log(
                "Quiz response:",
                quizResponse
            );


            const createdQuiz =
                quizResponse.data;


            const quizId =
                createdQuiz.quiz_id;


            console.log(
                "Created Quiz ID:",
                quizId
            );


            // =================================
            // STEP 2
            // CREATE QUESTIONS
            // =================================

            for (
                const question of questions
            ) {

                console.log(
                    "Creating question:",
                    question.text
                );


                const questionResponse =
                    await createQuestion({

                        quiz_id:
                            quizId,

                        question_text:
                            question.text.trim(),

                        question_type:
                            question.type,

                        marks:
                            Number(
                                question.points
                            ),

                        explanation:
                            ""
                    });


                console.log(
                    "Question response:",
                    questionResponse
                );


                const createdQuestion =
                    questionResponse.data;


                const questionId =
                    createdQuestion.question_id;


                // =================================
                // STEP 3
                // CREATE OPTIONS
                // =================================

                for (
                    const option of question.options
                ) {

                    console.log(
                        "Creating option:",
                        option.text
                    );


                    await createOption({

                        question_id:
                            questionId,

                        option_text:
                            option.text.trim(),

                        is_correct:
                            option.correct === true

                    });
                }
            }


            // =================================
            // STEP 4
            // CREATE LIVE SESSION
            // =================================

            console.log(
                "Creating live session..."
            );


            const sessionResponse =
                await api.post(
                    "/session/create",
                    {
                        quiz_id:
                            quizId
                    }
                );


            console.log(
                "Session response:",
                sessionResponse
            );


            const session =
                sessionResponse.data.data;


            if (
                !session ||
                !session.session_id ||
                !session.join_code
            ) {

                throw new Error(
                    "Live session was created but no join code was returned."
                );
            }


            console.log(
                "Live session created:",
                session
            );


            // =================================
            // STEP 5
            // GO TO JOIN CODE SCREEN
            // =================================

            navigate(
                "/teacher/live-session",
                {
                    state: {

                        sessionId:
                            session.session_id,

                        quizId:
                            quizId,

                        joinCode:
                            session.join_code
                    }
                }
            );


        } catch (error) {

            console.error(
                "Publish quiz error:",
                error
            );


            console.error(
                "Response:",
                error.response?.data
            );


            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to publish quiz.";


            alert(message);


        } finally {

            setPublishing(false);

        }
    };


    // =========================
    // Render
    // =========================

    return (

        <div className="create-quiz-page">


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="sidebar">


                <div className="sidebar-logo">

                    <div className="logo-mark">
                        Q
                    </div>

                    <span>
                        QuizVerse
                    </span>

                </div>


                <nav className="sidebar-nav">


                    <button
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

                    </button>


                    <button
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

                    </button>


                    <button
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

                    </button>


                    <button
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

                    </button>


                </nav>


                <div className="sidebar-settings">


                    <button
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

                    </button>


                </div>

            </aside>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="create-quiz-main">


                {/* =================================
                    TOP BAR
                ================================= */}

                <header className="topbar">


                    <div className="search-box">

                        <span>
                            ⌕
                        </span>

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

                                {user?.full_name ||
                                    "Teacher"}

                            </strong>


                            <small>
                                TEACHER VIEW
                            </small>

                        </div>


                        <div className="profile-avatar">

                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "T"}

                        </div>


                    </div>

                </header>


                {/* =================================
                    EDITOR HEADER
                ================================= */}

                <div className="editor-header">


                    <div>


                        <button
                            className="back-button"

                            onClick={() =>
                                navigate(
                                    "/teacher/quizzes"
                                )
                            }
                        >

                            ← Back to Quizzes

                        </button>


                        <input
                            className="quiz-title-input"

                            value={quizTitle}

                            onChange={(event) =>
                                setQuizTitle(
                                    event.target.value
                                )
                            }
                        />


                        <p>
                            Build your quiz and add
                            questions below.
                        </p>


                    </div>


                    <div className="editor-actions">


                        <button
                            className="preview-button"

                            onClick={() =>
                                alert(
                                    "Preview will be added later."
                                )
                            }
                        >

                            Preview

                        </button>


                        <button
                            className="publish-button"

                            onClick={
                                handlePublish
                            }

                            disabled={
                                publishing
                            }
                        >

                            {publishing
                                ? "Publishing..."
                                : "Publish"}

                        </button>


                    </div>

                </div>


                {/* =================================
                    EDITOR LAYOUT
                ================================= */}

                <div className="editor-layout">


                    {/* =================================
                        QUESTIONS
                    ================================= */}

                    <section className="questions-section">


                        {questions.map(
                            (
                                question,
                                questionIndex
                            ) => (

                                <div
                                    className="question-card"
                                    key={
                                        question.id
                                    }
                                >


                                    <div className="question-header">


                                        <div className="question-number">

                                            {
                                                questionIndex +
                                                1
                                            }

                                        </div>


                                        <span>
                                            Question
                                        </span>


                                        <button
                                            type="button"

                                            className="remove-question"

                                            onClick={() =>
                                                removeQuestion(
                                                    question.id
                                                )
                                            }
                                        >

                                            🗑

                                        </button>


                                    </div>


                                    <textarea
                                        className="question-input"

                                        placeholder="Write your question here..."

                                        value={
                                            question.text
                                        }

                                        onChange={(event) =>
                                            updateQuestion(
                                                question.id,
                                                event.target.value
                                            )
                                        }
                                    />


                                    {/* Question Type */}

                                    <div className="question-type-row">


                                        <label>
                                            Question Type
                                        </label>


                                        <select
                                            value={
                                                question.type
                                            }

                                            onChange={(event) => {

                                                const newType =
                                                    event.target.value;


                                                setQuestions(
                                                    (
                                                        currentQuestions
                                                    ) =>

                                                        currentQuestions.map(
                                                            (
                                                                item
                                                            ) =>

                                                                item.id ===
                                                                question.id

                                                                    ? {
                                                                        ...item,
                                                                        type: newType
                                                                    }

                                                                    : item
                                                        )
                                                );

                                            }}
                                        >

                                            <option value="MCQ">
                                                Multiple Choice
                                            </option>


                                            <option value="TrueFalse">
                                                True / False
                                            </option>

                                        </select>

                                    </div>


                                    {/* Options */}

                                    <div className="options-section">


                                        <div className="options-title">
                                            Answer Options
                                        </div>


                                        {question.options.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => (

                                                <div
                                                    className="option-row"

                                                    key={
                                                        option.id
                                                    }
                                                >


                                                    <button
                                                        type="button"

                                                        className={`correct-selector ${
                                                            option.correct
                                                                ? "selected"
                                                                : ""
                                                        }`}

                                                        onClick={() =>
                                                            selectCorrectOption(
                                                                question.id,
                                                                option.id
                                                            )
                                                        }
                                                    >

                                                        {option.correct
                                                            ? "✓"
                                                            : ""}

                                                    </button>


                                                    <span className="option-letter">

                                                        {String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        )}

                                                    </span>


                                                    <input
                                                        type="text"

                                                        placeholder={`Option ${
                                                            optionIndex +
                                                            1
                                                        }`}

                                                        value={
                                                            option.text
                                                        }

                                                        onChange={(event) =>
                                                            updateOption(
                                                                question.id,
                                                                option.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    />


                                                    <button
                                                        type="button"

                                                        className="remove-option"

                                                        onClick={() =>
                                                            removeOption(
                                                                question.id,
                                                                option.id
                                                            )
                                                        }
                                                    >

                                                        ×

                                                    </button>


                                                </div>

                                            )
                                        )}


                                        <button
                                            type="button"

                                            className="add-option-button"

                                            onClick={() =>
                                                addOption(
                                                    question.id
                                                )
                                            }
                                        >

                                            + Add Option

                                        </button>


                                    </div>


                                    {/* Points */}

                                    <div className="question-footer">


                                        <label>
                                            Points
                                        </label>


                                        <input
                                            type="number"

                                            min="1"

                                            value={
                                                question.points
                                            }

                                            onChange={(event) =>

                                                setQuestions(
                                                    (
                                                        currentQuestions
                                                    ) =>

                                                        currentQuestions.map(
                                                            (
                                                                item
                                                            ) =>

                                                                item.id ===
                                                                question.id

                                                                    ? {
                                                                        ...item,

                                                                        points:
                                                                            Number(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                    }

                                                                    : item
                                                        )
                                                )
                                            }
                                        />


                                    </div>


                                </div>

                            )
                        )}


                        {/* Add Question */}

                        <button
                            type="button"

                            className="add-question-button"

                            onClick={
                                addQuestion
                            }
                        >

                            + Add New Question

                        </button>


                    </section>


                    {/* =================================
                        QUIZ SETTINGS
                    ================================= */}

                    <aside className="quiz-settings">


                        <h2>
                            Quiz Settings
                        </h2>


                        {/* Subject */}

                        <div className="setting-group">

                            <label>
                                Subject
                            </label>


                            <input
                                type="text"

                                value={
                                    subject
                                }

                                onChange={(event) =>
                                    setSubject(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Difficulty */}

                        <div className="setting-group">

                            <label>
                                Difficulty
                            </label>


                            <div className="difficulty-buttons">

                                {[
                                    "Easy",
                                    "Medium",
                                    "Hard"
                                ].map(
                                    (level) => (

                                        <button
                                            type="button"

                                            key={
                                                level
                                            }

                                            className={
                                                difficulty ===
                                                level
                                                    ? "selected"
                                                    : ""
                                            }

                                            onClick={() =>
                                                setDifficulty(
                                                    level
                                                )
                                            }
                                        >

                                            {level}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Total Points */}

                        <div className="setting-group">

                            <label>
                                Total Points
                            </label>


                            <input
                                type="number"

                                min="1"

                                value={
                                    totalMarks
                                }

                                onChange={(event) =>
                                    setTotalMarks(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Description */}

                        <div className="setting-group">

                            <label>
                                Description
                            </label>


                            <textarea
                                placeholder="Describe your quiz..."

                                value={
                                    description
                                }

                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="settings-divider"></div>


                        <h3>
                            Options
                        </h3>


                        {/* Shuffle */}

                        <label className="toggle-row">

                            <span>
                                Shuffle Questions
                            </span>


                            <input
                                type="checkbox"

                                checked={
                                    shuffleQuestions
                                }

                                onChange={(event) =>
                                    setShuffleQuestions(
                                        event.target.checked
                                    )
                                }
                            />

                        </label>


                        {/* Feedback */}

                        <label className="toggle-row">

                            <span>
                                Show Feedback
                            </span>


                            <input
                                type="checkbox"

                                checked={
                                    showFeedback
                                }

                                onChange={(event) =>
                                    setShowFeedback(
                                        event.target.checked
                                    )
                                }
                            />

                        </label>


                        {/* AI */}

                        <button
                            type="button"

                            className="ai-button"

                            onClick={() =>
                                alert(
                                    "AI Assist will be connected later."
                                )
                            }
                        >

                            ✦ AI Assist

                        </button>


                    </aside>


                </div>


            </main>

        </div>
    );
}


export default CreateQuiz;