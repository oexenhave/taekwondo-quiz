/**
 * Quiz Component - Main quiz flow container
 */

import QuizCard from './QuizCard';

export default function Quiz({
  getCurrentQuestion,
  getProgress,
  answered,
  selectedAnswer,
  handleAnswerSelect,
  handleNext,
  isAnswerCorrect,
  onRestart
}) {
  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <QuizCard
      question={currentQuestion}
      progress={progress}
      answered={answered}
      selectedAnswer={selectedAnswer}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      isAnswerCorrect={isAnswerCorrect}
      onRestart={onRestart}
    />
  );
}
