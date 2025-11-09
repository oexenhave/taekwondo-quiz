/**
 * useQuiz Hook - Manage quiz state and progression
 */

import { useState, useEffect } from 'react';
import { selectQuestions } from '../utils/quizLogic';
import { generateQuestion } from '../utils/answerGenerator';

export function useQuiz(questionsData) {
  const [quizState, setQuizState] = useState('setup'); // 'setup', 'quiz', 'results'
  const [config, setConfig] = useState({
    beltRank: null,
    questionCount: null
  });

  const [questions, setQuestions] = useState([]);
  const [formattedQuestions, setFormattedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  /**
   * Start quiz with selected configuration
   */
  const startQuiz = (beltRank, questionCount) => {
    setConfig({ beltRank, questionCount });

    // Select questions based on algorithm
    const { questions: selectedQuestions } =
      selectQuestions(questionsData, beltRank, questionCount);

    setQuestions(selectedQuestions);

    // Format questions with randomized answers
    const formatted = selectedQuestions.map(q =>
      generateQuestion(q, questionsData, 'da')
    );
    setFormattedQuestions(formatted);

    // Reset state
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setQuizState('quiz');
  };

  /**
   * Handle answer selection
   */
  const handleAnswerSelect = (answer) => {
    if (answered) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    setAnswered(true);

    // Check if answer is correct
    const currentQuestion = formattedQuestions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  /**
   * Move to next question
   */
  const handleNext = () => {
    if (currentQuestionIndex < formattedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      setQuizState('results');
    }
  };

  /**
   * Restart quiz (back to setup)
   */
  const restartQuiz = () => {
    setQuizState('setup');
    setConfig({ beltRank: null, questionCount: null });
    setQuestions([]);
    setFormattedQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  /**
   * Get current question data
   */
  const getCurrentQuestion = () => {
    if (formattedQuestions.length === 0) return null;
    return formattedQuestions[currentQuestionIndex];
  };

  /**
   * Check if answer is correct
   */
  const isAnswerCorrect = (answer) => {
    const currentQuestion = getCurrentQuestion();
    return currentQuestion && answer === currentQuestion.correctAnswer;
  };

  /**
   * Get progress info
   */
  const getProgress = () => {
    return {
      current: currentQuestionIndex + 1,
      total: formattedQuestions.length
    };
  };

  /**
   * Get results data
   */
  const getResults = () => {
    const total = formattedQuestions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let message = '';
    if (percentage >= 90) {
      message = 'Fremragende! Du er en Taekwondo mester!';
    } else if (percentage >= 70) {
      message = 'Godt gået! Bliv ved med at øve!';
    } else if (percentage >= 50) {
      message = 'God indsats! Gennemgå og prøv igen.';
    } else {
      message = 'Bliv ved! Øvelse gør mester.';
    }

    return {
      score,
      total,
      percentage,
      message
    };
  };

  return {
    // State
    quizState,
    config,
    answered,
    selectedAnswer,

    // Actions
    startQuiz,
    handleAnswerSelect,
    handleNext,
    restartQuiz,

    // Getters
    getCurrentQuestion,
    isAnswerCorrect,
    getProgress,
    getResults
  };
}
