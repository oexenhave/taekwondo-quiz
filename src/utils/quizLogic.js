/**
 * Quiz Logic - Question Selection and Distribution
 * Implements adaptive distribution algorithm based on belt level
 */

// Belt rank hierarchy (progression order)
const BELT_RANKS = [
  '10_kup', '9_kup', '8_kup', '7_kup', '6_kup',
  '5_kup', '4_kup', '3_kup', '2_kup', '1_kup',
  '1_dan', '2_dan', '3_dan'
];

/**
 * Get distribution percentages based on number of previous levels
 * @param {number} previousLevels - Number of belt levels before current
 * @returns {number[]} - Array of percentages [current, -1, -2, -3, -4]
 */
function getDistribution(previousLevels) {
  if (previousLevels === 0) {
    return [1.0]; // 100% current level
  }

  if (previousLevels === 1) {
    return [0.7, 0.3]; // 70% current, 30% level-1
  }

  if (previousLevels === 2) {
    return [0.6, 0.25, 0.15]; // 60% current, 25% level-1, 15% level-2
  }

  if (previousLevels === 3) {
    return [0.6, 0.25, 0.10, 0.05]; // 60% current, 25% level-1, 10% level-2, 5% level-3
  }

  // 4+ previous levels
  return [0.5, 0.3, 0.1, 0.05, 0.05]; // 50% current, 30% level-1, 10% level-2, 5% level-3, 5% level-4
}

/**
 * Get belt ranks to include based on selected level
 * @param {string} selectedBeltRank - Selected belt rank (e.g., '5_kup')
 * @returns {string[]} - Array of belt ranks to include (current and previous)
 */
function getBeltRanksToInclude(selectedBeltRank) {
  const currentIndex = BELT_RANKS.indexOf(selectedBeltRank);

  if (currentIndex === -1) {
    throw new Error(`Invalid belt rank: ${selectedBeltRank}`);
  }

  // Return current and all previous ranks (10_kup is first, so lower index = earlier rank)
  return BELT_RANKS.slice(0, currentIndex + 1).reverse(); // Reverse to get [current, -1, -2, ...]
}

/**
 * Filter questions by belt ranks
 * @param {Object} questionsData - Complete questions data from JSON
 * @param {string[]} beltRanks - Array of belt ranks to include
 * @returns {Object} - Questions grouped by belt rank
 */
function filterQuestionsByBeltRanks(questionsData, beltRanks) {
  const grouped = {};

  // Initialize groups
  beltRanks.forEach(rank => {
    grouped[rank] = {
      vocabulary: [],
      theory: []
    };
  });

  // Group vocabulary questions
  questionsData.vocabularyQuestions.forEach(q => {
    if (beltRanks.includes(q.beltRank)) {
      grouped[q.beltRank].vocabulary.push(q);
    }
  });

  // Group theory questions (filter out those without sufficient incorrect answers)
  questionsData.theoryQuestions.forEach(q => {
    if (beltRanks.includes(q.beltRank)) {
      // Check if theory question has at least 1 incorrect answer
      const hasEnoughAnswers = q.incorrectAnswers.da && q.incorrectAnswers.da.length >= 1;
      if (hasEnoughAnswers) {
        grouped[q.beltRank].theory.push(q);
      }
    }
  });

  return grouped;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
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
 * Select questions based on distribution algorithm
 * @param {Object} questionsData - Complete questions data from JSON
 * @param {string} selectedBeltRank - Selected belt rank
 * @param {number} totalQuestions - Total number of questions requested
 * @returns {Object} - { questions: Array, warning: string|null }
 */
export function selectQuestions(questionsData, selectedBeltRank, totalQuestions) {
  // Get belt ranks to include
  const beltRanks = getBeltRanksToInclude(selectedBeltRank);
  const previousLevels = beltRanks.length - 1;

  // Get distribution percentages
  const distribution = getDistribution(previousLevels);

  // Filter and group questions
  const groupedQuestions = filterQuestionsByBeltRanks(questionsData, beltRanks);

  // Calculate target counts for each level
  const targetCounts = distribution.map(percentage =>
    Math.floor(percentage * totalQuestions)
  );

  // Collect questions from each level
  let selectedQuestions = [];
  let actualCounts = [];

  for (let i = 0; i < beltRanks.length && i < distribution.length; i++) {
    const rank = beltRanks[i];
    const targetCount = targetCounts[i];

    // Combine vocabulary and theory questions for this rank
    const availableQuestions = [
      ...groupedQuestions[rank].vocabulary,
      ...groupedQuestions[rank].theory
    ];

    // Shuffle and take up to target count
    const shuffled = shuffleArray(availableQuestions);
    const selected = shuffled.slice(0, targetCount);

    selectedQuestions.push(...selected);
    actualCounts.push(selected.length);
  }

  // Top-up logic: if we have fewer questions than requested, try to add more from current level
  if (selectedQuestions.length < totalQuestions) {
    const currentRank = beltRanks[0];
    const currentLevelQuestions = [
      ...groupedQuestions[currentRank].vocabulary,
      ...groupedQuestions[currentRank].theory
    ];

    // Remove already selected questions
    const alreadySelectedIds = new Set(selectedQuestions.map(q => q.id));
    const remainingQuestions = currentLevelQuestions.filter(q => !alreadySelectedIds.has(q.id));

    // Calculate how many more we need
    const needed = totalQuestions - selectedQuestions.length;
    const shuffled = shuffleArray(remainingQuestions);
    const additional = shuffled.slice(0, needed);

    selectedQuestions.push(...additional);
  }

  // Final shuffle to mix vocabulary and theory questions
  selectedQuestions = shuffleArray(selectedQuestions);

  // Check if we have enough questions
  let warning = null;
  if (selectedQuestions.length < totalQuestions) {
    warning = `Kun ${selectedQuestions.length} spørgsmål tilgængelige for dette niveau (du valgte ${totalQuestions})`;
  }

  return {
    questions: selectedQuestions,
    warning
  };
}

/**
 * Get all available belt ranks with display names
 * @param {Object} metadata - Metadata from questions JSON
 * @returns {Array} - Array of { value: string, label: string }
 */
export function getBeltRankOptions(metadata) {
  return BELT_RANKS.map(rank => ({
    value: rank,
    label: metadata.beltRanks[rank]?.da || rank
  }));
}
