/** Fisher–Yates: copy the input and keep answer identities through the shuffle. */
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleQuestionOptions<T extends { options: string[]; answer: number }>(question: T, random = Math.random): T {
  const order = shuffle(question.options.map((_, index) => index), random);
  return { ...question, options: order.map(index => question.options[index]), answer: order.indexOf(question.answer) };
}

export function shuffleMultipleAnswers<T extends { options: string[]; correctAnswers: number[] }>(question: T, random = Math.random): T {
  const order = shuffle(question.options.map((_, index) => index), random);
  return {
    ...question,
    options: order.map(index => question.options[index]),
    correctAnswers: order.flatMap((original, index) => question.correctAnswers.includes(original) ? [index] : [])
  };
}
