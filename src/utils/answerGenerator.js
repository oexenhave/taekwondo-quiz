/**
 * Answer Generator - Create randomized answer options for questions
 * Handles both vocabulary (bidirectional) and theory questions
 */

// Belt rank hierarchy
const BELT_RANKS = [
  '10_kup', '9_kup', '8_kup', '7_kup', '6_kup',
  '5_kup', '4_kup', '3_kup', '2_kup', '1_kup',
  '1_dan', '2_dan', '3_dan'
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get lower belt ranks (easier levels)
 * @param {string} beltRank - Current belt rank
 * @param {number} count - Number of lower ranks to get
 * @returns {string[]} - Array of lower belt ranks
 */
function getLowerBeltRanks(beltRank, count = 4) {
  const currentIndex = BELT_RANKS.indexOf(beltRank);
  if (currentIndex === -1) return [];

  // Get ranks before current (lower indices = easier belts)
  return BELT_RANKS.slice(Math.max(0, currentIndex - count), currentIndex);
}

/**
 * Generate incorrect answers for vocabulary question
 * @param {Object} question - Vocabulary question
 * @param {string} targetLang - Target language ('da', 'ko', or 'en')
 * @param {Object} questionsData - Complete questions data
 * @returns {string[]} - Array of 3 incorrect answers
 */
function generateVocabularyIncorrectAnswers(question, targetLang, questionsData) {
  const correctAnswer = question.translations[targetLang];
  const pool = [];

  // Helper to add unique answers to pool
  const addToPool = (answer) => {
    if (answer && answer !== correctAnswer && !pool.includes(answer)) {
      pool.push(answer);
    }
  };

  // 1. Try same category first
  const sameCategoryQuestions = questionsData.vocabularyQuestions.filter(
    q => q.category === question.category && q.id !== question.id
  );
  sameCategoryQuestions.forEach(q => addToPool(q.translations[targetLang]));

  // 2. If insufficient, add from same belt rank
  if (pool.length < 3) {
    const sameBeltQuestions = questionsData.vocabularyQuestions.filter(
      q => q.beltRank === question.beltRank && q.id !== question.id
    );
    sameBeltQuestions.forEach(q => addToPool(q.translations[targetLang]));
  }

  // 3. If still insufficient, add from lower (easier) belt ranks
  if (pool.length < 3) {
    const lowerRanks = getLowerBeltRanks(question.beltRank);
    const lowerRankQuestions = questionsData.vocabularyQuestions.filter(
      q => lowerRanks.includes(q.beltRank) && q.id !== question.id
    );
    lowerRankQuestions.forEach(q => addToPool(q.translations[targetLang]));
  }

  // Shuffle and take 3
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, 3);
}

/**
 * Generate question data for vocabulary question
 * @param {Object} question - Vocabulary question from data
 * @param {Object} questionsData - Complete questions data
 * @param {string} language - User's language preference ('da' for MVP)
 * @returns {Object} - Question with answers and metadata
 */
export function generateVocabularyQuestion(question, questionsData, language = 'da') {
  // Randomly select direction: ko→da or da→ko (50/50)
  const directions = ['ko_to_da', 'da_to_ko'];
  const direction = directions[Math.floor(Math.random() * directions.length)];

  let sourceLang, targetLang, questionText, correctAnswer;

  if (direction === 'ko_to_da') {
    sourceLang = 'ko';
    targetLang = 'da';
    questionText = `Hvad er "${question.translations.ko}" på dansk?`;
    correctAnswer = question.translations.da;
  } else {
    sourceLang = 'da';
    targetLang = 'ko';
    questionText = `Hvad er "${question.translations.da}" på koreansk?`;
    correctAnswer = question.translations.ko;
  }

  // Get incorrect answers
  let incorrectAnswers = [];

  if (question.incorrectAnswers[targetLang] && question.incorrectAnswers[targetLang].length > 0) {
    // Use provided incorrect answers
    incorrectAnswers = question.incorrectAnswers[targetLang].slice(0, 3);
  } else {
    // Generate random incorrect answers
    incorrectAnswers = generateVocabularyIncorrectAnswers(question, targetLang, questionsData);
  }

  // Combine and shuffle all answers
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  const shuffledAnswers = shuffleArray(allAnswers);

  return {
    id: question.id,
    type: 'vocabulary',
    questionText,
    answers: shuffledAnswers,
    correctAnswer,
    beltRank: question.beltRank,
    category: question.category
  };
}

/**
 * Generate question data for theory question
 * @param {Object} question - Theory question from data
 * @param {string} language - User's language preference ('da' for MVP)
 * @returns {Object} - Question with answers and metadata
 */
export function generateTheoryQuestion(question, language = 'da') {
  const questionText = question.question[language];
  const correctAnswer = question.correctAnswer[language];
  let incorrectAnswers = question.incorrectAnswers[language] || [];

  // Randomly select 3 incorrect answers if more than 3 are available
  if (incorrectAnswers.length > 3) {
    incorrectAnswers = shuffleArray(incorrectAnswers).slice(0, 3);
  }

  // Combine and shuffle all answers
  const allAnswers = [correctAnswer, ...incorrectAnswers];
  const shuffledAnswers = shuffleArray(allAnswers);

  return {
    id: question.id,
    type: 'theory',
    questionText,
    answers: shuffledAnswers,
    correctAnswer,
    beltRank: question.beltRank
  };
}

/**
 * Generate question data for display (main entry point)
 * @param {Object} question - Raw question from data
 * @param {Object} questionsData - Complete questions data
 * @param {string} language - User's language preference
 * @returns {Object} - Formatted question with answers
 */
export function generateQuestion(question, questionsData, language = 'da') {
  // Determine question type based on structure
  if (question.translations) {
    // Vocabulary question
    return generateVocabularyQuestion(question, questionsData, language);
  } else if (question.question) {
    // Theory question
    return generateTheoryQuestion(question, language);
  } else {
    throw new Error('Unknown question type');
  }
}
