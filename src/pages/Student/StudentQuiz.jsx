import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import "./StudentQuiz.css";


function StudentQuiz() {

    const { sessionId } = useParams();
    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [session, setSession] = useState(null);

    const [quiz, setQuiz] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [submitted, setSubmitted] = useState(false);


    // ==========================================
    // LOAD SESSION + QUIZ
    // ==========================================

    useEffect(() => {

        const loadQuiz = async () => {

            try {

                setLoading(true);
                setError("");


                // ----------------------------------
                // Get Session
                // ----------------------------------

                const sessionResponse = await api.get(
                    `/session/${sessionId}`
                );

                const sessionData =
                    sessionResponse.data.data;

                setSession(sessionData);


                // ----------------------------------
                // Make sure session is still live
                // ----------------------------------

                if (sessionData.status !== "Live") {

                    setError(
                        "This quiz session is not currently live."
                    );

                    return;
                }


                // ----------------------------------
                // Get Quiz
                // ----------------------------------

                const quizResponse = await api.get(
                    `/quizzes/${sessionData.quiz_id}`
                );

                const quizData =
                    quizResponse.data.data;


                setQuiz(quizData);

                setQuestions(
                    quizData.questions || []
                );


            } catch (error) {

                console.error(
                    "Failed to load quiz:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load the quiz."
                );

            } finally {

                setLoading(false);

            }

        };


        loadQuiz();

    }, [sessionId]);


    // ==========================================
    // SELECT ANSWER
    // ==========================================

    const selectAnswer = (optionId) => {

        setAnswers((previousAnswers) => ({
            ...previousAnswers,

            [currentQuestion]: optionId
        }));

    };


    // ==========================================
    // NEXT QUESTION
    // ==========================================

    const nextQuestion = () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        }

    };


    // ==========================================
    // PREVIOUS QUESTION
    // ==========================================

    const previousQuestion = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

        }

    };


    // ==========================================
    // SUBMIT QUIZ
    // ==========================================

    const submitQuiz = () => {

        setSubmitted(true);

        console.log(
            "Student Answers:",
            answers
        );

        /*
            IMPORTANT:

            We are NOT saving answers to the
            database yet.

            We will add the answer submission
            API next.

            That API will allow us to build:

            - Student progress
            - Correct answers
            - Teacher leaderboard
            - Results
        */

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="student-quiz-page">

                <div className="student-quiz-loading">

                    <div className="quiz-spinner"></div>

                    <h2>
                        Loading Quiz...
                    </h2>

                    <p>
                        Please wait while we load
                        your questions.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="student-quiz-page">

                <div className="student-quiz-error">

                    <div className="quiz-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Start Quiz
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/student/session/${sessionId}`
                            )
                        }
                    >
                        Back to Session
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // NO QUESTIONS
    // ==========================================

    if (
        !quiz ||
        questions.length === 0
    ) {

        return (

            <div className="student-quiz-page">

                <div className="student-quiz-error">

                    <div className="quiz-error-icon">
                        !
                    </div>

                    <h2>
                        No Questions Found
                    </h2>

                    <p>
                        This quiz does not contain
                        any questions yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                `/student/session/${sessionId}`
                            )
                        }
                    >
                        Back to Session
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // SUBMITTED
    // ==========================================

    if (submitted) {

        return (

            <div className="student-quiz-page">

                <div className="student-quiz-card submit-card">

                    <div className="submit-icon">
                        🎉
                    </div>

                    <h1>
                        Quiz Submitted!
                    </h1>

                    <p>
                        Your answers have been submitted.
                    </p>

                    <div className="submit-summary">

                        <div>
                            <strong>
                                {Object.keys(answers).length}
                            </strong>

                            <span>
                                Questions Answered
                            </span>
                        </div>

                        <div>
                            <strong>
                                {questions.length}
                            </strong>

                            <span>
                                Total Questions
                            </span>
                        </div>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // CURRENT QUESTION
    // ==========================================

    const question =
        questions[currentQuestion];

    const selectedOption =
        answers[currentQuestion];


    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;


    // ==========================================
    // MAIN QUIZ
    // ==========================================

    return (

        <div className="student-quiz-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="student-quiz-header">

                <div className="student-quiz-logo">

                    <div className="student-quiz-logo-mark">
                        Q
                    </div>

                    <span>
                        QuizVerse
                    </span>

                </div>


                <div className="student-quiz-title">

                    <span>
                        {quiz.title}
                    </span>

                </div>


                <div className="student-quiz-session">

                    Session #{session.session_id}

                </div>

            </header>


            {/* ==================================
                QUIZ CONTAINER
            ================================== */}

            <main className="student-quiz-container">


                {/* ==================================
                    PROGRESS
                ================================== */}

                <div className="quiz-progress-section">

                    <div className="quiz-progress-info">

                        <span>
                            Question {currentQuestion + 1}
                            {" "}of{" "}
                            {questions.length}
                        </span>

                        <span>
                            {Math.round(progress)}%
                        </span>

                    </div>


                    <div className="quiz-progress-bar">

                        <div
                            className="quiz-progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        ></div>

                    </div>

                </div>


                {/* ==================================
                    QUESTION CARD
                ================================== */}

                <div className="student-question-card">


                    <div className="question-number">

                        Question {currentQuestion + 1}

                    </div>


                    <h1 className="student-question-text">

                        {question.question_text}

                    </h1>


                    {/* ==================================
                        OPTIONS
                    ================================== */}

                    <div className="student-options">

                        {question.options?.map(
                            (option, index) => {

                                const isSelected =
                                    selectedOption ===
                                    option.option_id;


                                const letter =
                                    String.fromCharCode(
                                        65 + index
                                    );


                                return (

                                    <button
                                        key={
                                            option.option_id
                                        }

                                        className={
                                            isSelected
                                                ? "student-option selected"
                                                : "student-option"
                                        }

                                        onClick={() =>
                                            selectAnswer(
                                                option.option_id
                                            )
                                        }
                                    >

                                        <span className="option-letter">

                                            {letter}

                                        </span>


                                        <span className="option-text">

                                            {option.option_text}

                                        </span>


                                        <span className="option-check">

                                            {isSelected
                                                ? "✓"
                                                : ""}

                                        </span>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* ==================================
                    NAVIGATION
                ================================== */}

                <div className="quiz-navigation">


                    <button
                        className="previous-button"

                        onClick={previousQuestion}

                        disabled={
                            currentQuestion === 0
                        }
                    >

                        ← Previous

                    </button>


                    <div className="question-dots">

                        {questions.map(
                            (_, index) => (

                                <button
                                    key={index}

                                    className={

                                        answers[index]
                                            ? "question-dot answered"
                                            : index ===
                                              currentQuestion
                                            ? "question-dot current"
                                            : "question-dot"

                                    }

                                    onClick={() =>
                                        setCurrentQuestion(
                                            index
                                        )
                                    }
                                >

                                    {index + 1}

                                </button>

                            )
                        )}

                    </div>


                    {currentQuestion ===
                    questions.length - 1 ? (

                        <button
                            className="submit-button"

                            onClick={submitQuiz}
                        >

                            Submit Quiz ✓

                        </button>

                    ) : (

                        <button
                            className="next-button"

                            onClick={nextQuestion}
                        >

                            Next →

                        </button>

                    )}

                </div>


            </main>

        </div>

    );

}


export default StudentQuiz;