import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import {
    createQuiz,
    getQuizById,
    updateQuiz
} from "../../services/quizService";

import {
    createQuestion,
    getQuestionsByQuizId
} from "../../services/questionService";

import {
    createOption,
    getOptionsByQuestionId
} from "../../services/optionService";

import { useAuth } from "../../context/authContext";

import "./CreateQuiz.css";


function CreateQuiz() {

    const navigate = useNavigate();

    // IMPORTANT:
    // App.jsx uses :quizId
    const { quizId } = useParams();

    const { user } = useAuth();

    const isEditMode = Boolean(quizId);


    // ==========================================
    // STATE
    // ==========================================

    const [loading, setLoading] =
        useState(isEditMode);

    const [saving, setSaving] =
        useState(false);


    // ==========================================
    // QUIZ INFORMATION
    // ==========================================

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


    // ==========================================
    // SETTINGS
    // ==========================================

    const [shuffleQuestions, setShuffleQuestions] =
        useState(false);

    const [showFeedback, setShowFeedback] =
        useState(true);


    // ==========================================
    // QUESTIONS
    // ==========================================

    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            databaseId: null,

            text: "",

            type: "MCQ",

            points: 1,

            options: [
                {
                    id: Date.now() + 1,
                    databaseId: null,
                    text: "",
                    correct: true
                },
                {
                    id: Date.now() + 2,
                    databaseId: null,
                    text: "",
                    correct: false
                },
                {
                    id: Date.now() + 3,
                    databaseId: null,
                    text: "",
                    correct: false
                },
                {
                    id: Date.now() + 4,
                    databaseId: null,
                    text: "",
                    correct: false
                }
            ]
        }
    ]);


    // ==========================================
    // LOAD EXISTING QUIZ
    // ==========================================

    useEffect(() => {

        // Creating a new quiz
        if (!isEditMode) {

            setLoading(false);

            return;

        }


        const loadQuiz = async () => {

            try {

                setLoading(true);


                // ==================================
                // 1. GET QUIZ
                // ==================================

                const quizResponse =
                    await getQuizById(quizId);

                const quiz =
                    quizResponse.data;


                if (!quiz) {

                    throw new Error(
                        "Quiz not found."
                    );

                }


                // ==================================
                // 2. LOAD QUIZ INFORMATION
                // ==================================

                setQuizTitle(
                    quiz.title ||
                    "Untitled Quiz"
                );

                setSubject(
                    quiz.subject ||
                    "History"
                );

                setDifficulty(
                    quiz.difficulty ||
                    "Medium"
                );

                setTotalMarks(
                    quiz.total_marks ||
                    10
                );

                setDescription(
                    quiz.description ||
                    ""
                );


                // ==================================
                // 3. GET QUESTIONS
                // ==================================

                const questionResponse =
                    await getQuestionsByQuizId(
                        quizId
                    );

                const databaseQuestions =
                    questionResponse.data || [];


                // ==================================
                // 4. LOAD OPTIONS
                // ==================================

                const loadedQuestions =
                    await Promise.all(

                        databaseQuestions.map(
                            async (
                                question
                            ) => {

                                const optionResponse =
                                    await getOptionsByQuestionId(
                                        question.question_id
                                    );

                                const databaseOptions =
                                    optionResponse.data ||
                                    [];


                                return {

                                    id:
                                        question.question_id,

                                    databaseId:
                                        question.question_id,

                                    text:
                                        question.question_text ||
                                        "",

                                    type:
                                        question.question_type ||
                                        "MCQ",

                                    points:
                                        Number(
                                            question.marks ||
                                            1
                                        ),

                                    options:
                                        databaseOptions.map(
                                            option => ({

                                                id:
                                                    option.option_id,

                                                databaseId:
                                                    option.option_id,

                                                text:
                                                    option.option_text ||
                                                    "",

                                                correct:
                                                    option.is_correct ===
                                                    true

                                            })
                                        )

                                };

                            }
                        )

                    );


                // ==================================
                // 5. PUT INTO REACT STATE
                // ==================================

                if (
                    loadedQuestions.length > 0
                ) {

                    setQuestions(
                        loadedQuestions
                    );

                } else {

                    // No questions found.
                    // Keep one blank question.

                    setQuestions([
                        createBlankQuestion()
                    ]);

                }

            } catch (error) {

                console.error(
                    "Failed to load quiz:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load quiz."
                );

                navigate(
                    "/teacher/quizzes"
                );

            } finally {

                setLoading(false);

            }

        };


        loadQuiz();

    }, [
        quizId,
        isEditMode,
        navigate
    ]);


    // ==========================================
    // CREATE BLANK QUESTION
    // ==========================================

    const createBlankQuestion = () => {

        const id = Date.now();

        return {

            id,

            databaseId: null,

            text: "",

            type: "MCQ",

            points: 1,

            options: [

                {
                    id: id + 1,
                    databaseId: null,
                    text: "",
                    correct: true
                },

                {
                    id: id + 2,
                    databaseId: null,
                    text: "",
                    correct: false
                },

                {
                    id: id + 3,
                    databaseId: null,
                    text: "",
                    correct: false
                },

                {
                    id: id + 4,
                    databaseId: null,
                    text: "",
                    correct: false
                }

            ]

        };

    };


    // ==========================================
    // UPDATE QUESTION TEXT
    // ==========================================

    const updateQuestion = (
        questionId,
        value
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question =>
                        question.id ===
                        questionId
                            ? {
                                ...question,
                                text: value
                            }
                            : question
                )
        );

    };


    // ==========================================
    // UPDATE QUESTION TYPE
    // ==========================================

    const updateQuestionType = (
        questionId,
        value
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question =>
                        question.id ===
                        questionId
                            ? {
                                ...question,
                                type: value
                            }
                            : question
                )
        );

    };


    // ==========================================
    // UPDATE POINTS
    // ==========================================

    const updateQuestionPoints = (
        questionId,
        value
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question =>
                        question.id ===
                        questionId
                            ? {
                                ...question,
                                points:
                                    Number(value)
                            }
                            : question
                )
        );

    };


    // ==========================================
    // UPDATE OPTION
    // ==========================================

    const updateOption = (
        questionId,
        optionId,
        value
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question => {

                        if (
                            question.id !==
                            questionId
                        ) {
                            return question;
                        }


                        return {

                            ...question,

                            options:
                                question.options.map(
                                    option =>
                                        option.id ===
                                        optionId
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


    // ==========================================
    // SELECT CORRECT OPTION
    // ==========================================

    const selectCorrectOption = (
        questionId,
        optionId
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question => {

                        if (
                            question.id !==
                            questionId
                        ) {
                            return question;
                        }


                        return {

                            ...question,

                            options:
                                question.options.map(
                                    option => ({

                                        ...option,

                                        correct:
                                            option.id ===
                                            optionId

                                    })
                                )

                        };

                    }
                )
        );

    };


    // ==========================================
    // ADD OPTION
    // ==========================================

    const addOption = (
        questionId
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question => {

                        if (
                            question.id !==
                            questionId
                        ) {
                            return question;
                        }


                        return {

                            ...question,

                            options: [

                                ...question.options,

                                {
                                    id: Date.now(),
                                    databaseId: null,
                                    text: "",
                                    correct: false
                                }

                            ]

                        };

                    }
                )
        );

    };


    // ==========================================
    // REMOVE OPTION
    // ==========================================

    const removeOption = (
        questionId,
        optionId
    ) => {

        setQuestions(
            currentQuestions =>
                currentQuestions.map(
                    question => {

                        if (
                            question.id !==
                            questionId
                        ) {
                            return question;
                        }


                        if (
                            question.options.length <=
                            2
                        ) {
                            return question;
                        }


                        return {

                            ...question,

                            options:
                                question.options.filter(
                                    option =>
                                        option.id !==
                                        optionId
                                )

                        };

                    }
                )
        );

    };


    // ==========================================
    // ADD QUESTION
    // ==========================================

    const addQuestion = () => {

        setQuestions(
            currentQuestions => [
                ...currentQuestions,
                createBlankQuestion()
            ]
        );

    };


    // ==========================================
    // REMOVE QUESTION
    // ==========================================

    const removeQuestion = (
        questionId
    ) => {

        if (
            questions.length <= 1
        ) {
            return;
        }


        setQuestions(
            currentQuestions =>
                currentQuestions.filter(
                    question =>
                        question.id !==
                        questionId
                )
        );

    };


    // ==========================================
    // VALIDATE QUIZ
    // ==========================================

    const validateQuiz = () => {

        if (
            !quizTitle.trim()
        ) {

            alert(
                "Please enter a quiz title."
            );

            return false;

        }


        if (
            !subject.trim()
        ) {

            alert(
                "Please enter a subject."
            );

            return false;

        }


        if (
            questions.length === 0
        ) {

            alert(
                "Please add at least one question."
            );

            return false;

        }


        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const question =
                questions[i];


            if (
                !question.text.trim()
            ) {

                alert(
                    `Please enter Question ${i + 1}.`
                );

                return false;

            }


            if (
                !question.options ||
                question.options.length < 2
            ) {

                alert(
                    `Question ${i + 1} must have at least 2 options.`
                );

                return false;

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

                    return false;

                }

            }


            const hasCorrectAnswer =
                question.options.some(
                    option =>
                        option.correct === true
                );


            if (
                !hasCorrectAnswer
            ) {

                alert(
                    `Please select a correct answer for Question ${
                        i + 1
                    }.`
                );

                return false;

            }

        }


        return true;

    };


    // ==========================================
    // CREATE NEW QUIZ
    // ==========================================

    const createNewQuiz = async () => {

        // ==================================
        // CREATE QUIZ
        // ==================================

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


        const createdQuiz =
            quizResponse.data;


        const newQuizId =
            createdQuiz.quiz_id;


        // ==================================
        // CREATE QUESTIONS
        // ==================================

        for (
            const question
            of questions
        ) {

            const questionResponse =
                await createQuestion({

                    quiz_id:
                        newQuizId,

                    question_text:
                        question.text.trim(),

                    question_type:
                        question.type ===
                        "TrueFalse"
                            ? "TrueFalse"
                            : "MCQ",

                    marks:
                        Number(
                            question.points
                        ),

                    explanation:
                        ""

                });


            const createdQuestion =
                questionResponse.data;


            const newQuestionId =
                createdQuestion.question_id;


            // ==================================
            // CREATE OPTIONS
            // ==================================

            for (
                const option
                of question.options
            ) {

                await createOption({

                    question_id:
                        newQuestionId,

                    option_text:
                        option.text.trim(),

                    is_correct:
                        option.correct === true

                });

            }

        }


        // ==================================
        // CREATE LIVE SESSION
        // ==================================

        const sessionResponse =
            await api.post(
                "/session/create",
                {
                    quiz_id:
                        newQuizId
                }
            );


        const session =
            sessionResponse.data.data;


        if (
            !session ||
            !session.session_id ||
            !session.join_code
        ) {

            throw new Error(
                "Quiz was created, but the live session could not be created."
            );

        }


        // ==================================
        // GO TO JOIN CODE SCREEN
        // ==================================

        navigate(
            "/teacher/live-session",
            {
                state: {

                    sessionId:
                        session.session_id,

                    quizId:
                        newQuizId,

                    joinCode:
                        session.join_code

                }
            }
        );

    };


    // ==========================================
    // UPDATE EXISTING QUIZ
    // ==========================================

    const updateExistingQuiz = async () => {

        // ==================================
        // UPDATE QUIZ
        // ==================================

        await updateQuiz(
            quizId,
            {

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

            }
        );


        // ==================================
        // GET ORIGINAL QUESTIONS
        // ==================================

        const questionResponse =
            await getQuestionsByQuizId(
                quizId
            );

        const originalQuestions =
            questionResponse.data || [];


        // ==================================
        // LOAD ORIGINAL OPTIONS
        // ==================================

        const originalQuestionsWithOptions =
            await Promise.all(

                originalQuestions.map(
                    async question => {

                        const response =
                            await getOptionsByQuestionId(
                                question.question_id
                            );

                        return {

                            ...question,

                            options:
                                response.data ||
                                []

                        };

                    }
                )

            );


        // ==================================
        // PROCESS CURRENT QUESTIONS
        // ==================================

        for (
            const question
            of questions
        ) {

            // ==================================
            // EXISTING QUESTION
            // ==================================

            if (
                question.databaseId
            ) {

                await api.put(
                    `/questions/${question.databaseId}`,
                    {

                        question_text:
                            question.text.trim(),

                        question_type:
                            question.type ===
                            "TrueFalse"
                                ? "TrueFalse"
                                : "MCQ",

                        marks:
                            Number(
                                question.points
                            ),

                        explanation:
                            ""

                    }
                );


                // ==================================
                // PROCESS OPTIONS
                // ==================================

                for (
                    const option
                    of question.options
                ) {

                    if (
                        option.databaseId
                    ) {

                        await api.put(
                            `/options/${option.databaseId}`,
                            {

                                option_text:
                                    option.text.trim(),

                                is_correct:
                                    option.correct ===
                                    true

                            }
                        );

                    } else {

                        await createOption({

                            question_id:
                                question.databaseId,

                            option_text:
                                option.text.trim(),

                            is_correct:
                                option.correct ===
                                true

                        });

                    }

                }


                // ==================================
                // DELETE REMOVED OPTIONS
                // ==================================

                const originalQuestion =
                    originalQuestionsWithOptions.find(
                        item =>
                            item.question_id ===
                            question.databaseId
                    );


                if (
                    originalQuestion
                ) {

                    const currentOptionIds =
                        question.options
                            .filter(
                                option =>
                                    option.databaseId
                            )
                            .map(
                                option =>
                                    option.databaseId
                            );


                    for (
                        const originalOption
                        of originalQuestion.options
                    ) {

                        if (
                            !currentOptionIds.includes(
                                originalOption.option_id
                            )
                        ) {

                            await api.delete(
                                `/options/${originalOption.option_id}`
                            );

                        }

                    }

                }

            }

            // ==================================
            // NEW QUESTION
            // ==================================

            else {

                const questionResponse =
                    await createQuestion({

                        quiz_id:
                            Number(quizId),

                        question_text:
                            question.text.trim(),

                        question_type:
                            question.type ===
                            "TrueFalse"
                                ? "TrueFalse"
                                : "MCQ",

                        marks:
                            Number(
                                question.points
                            ),

                        explanation:
                            ""

                    });


                const createdQuestion =
                    questionResponse.data;


                const newQuestionId =
                    createdQuestion.question_id;


                for (
                    const option
                    of question.options
                ) {

                    await createOption({

                        question_id:
                            newQuestionId,

                        option_text:
                            option.text.trim(),

                        is_correct:
                            option.correct ===
                            true

                    });

                }

            }

        }


        // ==================================
        // DELETE REMOVED QUESTIONS
        // ==================================

        const currentQuestionIds =
            questions
                .filter(
                    question =>
                        question.databaseId
                )
                .map(
                    question =>
                        question.databaseId
                );


        for (
            const originalQuestion
            of originalQuestions
        ) {

            if (
                !currentQuestionIds.includes(
                    originalQuestion.question_id
                )
            ) {

                // Delete options first

                const options =
                    originalQuestionsWithOptions.find(
                        question =>
                            question.question_id ===
                            originalQuestion.question_id
                    )?.options || [];


                for (
                    const option
                    of options
                ) {

                    await api.delete(
                        `/options/${option.option_id}`
                    );

                }


                // Delete question

                await api.delete(
                    `/questions/${originalQuestion.question_id}`
                );

            }

        }


        alert(
            "Quiz updated successfully!"
        );


        navigate(
            "/teacher/quizzes"
        );

    };


    // ==========================================
    // PUBLISH / SAVE
    // ==========================================

    const handlePublish = async () => {

        if (
            saving
        ) {
            return;
        }


        if (
            !validateQuiz()
        ) {
            return;
        }


        try {

            setSaving(true);


            if (
                isEditMode
            ) {

                await updateExistingQuiz();

            } else {

                await createNewQuiz();

            }

        } catch (error) {

            console.error(
                "Quiz save error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to save quiz."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (
        loading
    ) {

        return (

            <div
                className="create-quiz-page"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <div>

                    <h2>
                        Loading Quiz...
                    </h2>

                    <p>
                        Loading your questions and options.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

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
                MAIN
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
                            onChange={
                                event =>
                                    setQuizTitle(
                                        event.target.value
                                    )
                            }
                        />


                        <p>

                            {
                                isEditMode
                                    ? "Edit your quiz and save your changes."
                                    : "Build your quiz and add questions below."
                            }

                        </p>

                    </div>


                    <div className="editor-actions">

                        <button
                            className="preview-button"
                            onClick={() =>
                                alert(
                                    "Preview will be added next."
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
                                saving
                            }
                        >

                            {
                                saving
                                    ? (
                                        isEditMode
                                            ? "Saving..."
                                            : "Publishing..."
                                    )
                                    : (
                                        isEditMode
                                            ? "Save Changes"
                                            : "Publish"
                                    )
                            }

                        </button>

                    </div>

                </div>


                {/* =================================
                    EDITOR
                ================================= */}

                <div className="editor-layout">


                    {/* QUESTIONS */}

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


                                    {/* QUESTION HEADER */}

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


                                    {/* QUESTION */}

                                    <textarea
                                        className="question-input"
                                        placeholder="Write your question here..."
                                        value={
                                            question.text
                                        }
                                        onChange={
                                            event =>
                                                updateQuestion(
                                                    question.id,
                                                    event.target.value
                                                )
                                        }
                                    />


                                    {/* QUESTION TYPE */}

                                    <div className="question-type-row">

                                        <label>
                                            Question Type
                                        </label>


                                        <select
                                            value={
                                                question.type
                                            }
                                            onChange={
                                                event =>
                                                    updateQuestionType(
                                                        question.id,
                                                        event.target.value
                                                    )
                                            }
                                        >

                                            <option value="MCQ">
                                                Multiple Choice
                                            </option>

                                            <option value="TrueFalse">
                                                True / False
                                            </option>

                                        </select>

                                    </div>


                                    {/* OPTIONS */}

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

                                                        {
                                                            option.correct
                                                                ? "✓"
                                                                : ""
                                                        }

                                                    </button>


                                                    <span className="option-letter">

                                                        {
                                                            String.fromCharCode(
                                                                65 +
                                                                optionIndex
                                                            )
                                                        }

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
                                                        onChange={
                                                            event =>
                                                                updateOption(
                                                                    question.id,
                                                                    option.id,
                                                                    event.target.value
                                                                )
                                                        }
                                                    />


                                                    <button
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


                                    {/* POINTS */}

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
                                            onChange={
                                                event =>
                                                    updateQuestionPoints(
                                                        question.id,
                                                        event.target.value
                                                    )
                                            }
                                        />

                                    </div>

                                </div>

                            )
                        )}


                        {/* ADD QUESTION */}

                        <button
                            className="add-question-button"
                            onClick={
                                addQuestion
                            }
                        >

                            + Add New Question

                        </button>

                    </section>


                    {/* =================================
                        SETTINGS
                    ================================= */}

                    <aside className="quiz-settings">

                        <h2>
                            Quiz Settings
                        </h2>


                        {/* SUBJECT */}

                        <div className="setting-group">

                            <label>
                                Subject
                            </label>

                            <input
                                type="text"
                                value={
                                    subject
                                }
                                onChange={
                                    event =>
                                        setSubject(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* DIFFICULTY */}

                        <div className="setting-group">

                            <label>
                                Difficulty
                            </label>


                            <div className="difficulty-buttons">

                                {
                                    [
                                        "Easy",
                                        "Medium",
                                        "Hard"
                                    ].map(
                                        level => (

                                            <button
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
                                    )
                                }

                            </div>

                        </div>


                        {/* TOTAL POINTS */}

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
                                onChange={
                                    event =>
                                        setTotalMarks(
                                            event.target.value
                                        )
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="setting-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Describe your quiz..."
                                value={
                                    description
                                }
                                onChange={
                                    event =>
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


                        {/* SHUFFLE */}

                        <label className="toggle-row">

                            <span>
                                Shuffle Questions
                            </span>

                            <input
                                type="checkbox"
                                checked={
                                    shuffleQuestions
                                }
                                onChange={
                                    event =>
                                        setShuffleQuestions(
                                            event.target.checked
                                        )
                                }
                            />

                        </label>


                        {/* FEEDBACK */}

                        <label className="toggle-row">

                            <span>
                                Show Feedback
                            </span>

                            <input
                                type="checkbox"
                                checked={
                                    showFeedback
                                }
                                onChange={
                                    event =>
                                        setShowFeedback(
                                            event.target.checked
                                        )
                                }
                            />

                        </label>


                        {/* AI */}

                        <button
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