/** Captions for the memory tunnel — cycles for any number of photos */
const BASE_CAPTIONS = [
  "The day we met.",
  "The day I couldn't stop smiling.",
  "One of my favorite memories.",
  "Still makes me laugh.",
  "I knew you were special.",
  "This moment changed everything.",
  "Look at us.",
  "Pure happiness.",
  "My favorite adventure with you.",
  "You make ordinary days extraordinary.",
  "I fall for you again and again.",
  "This smile — I live for it.",
  "Us against the world.",
  "A perfect little moment.",
  "I still think about this day.",
  "You looked so beautiful.",
  "We were so happy.",
  "My heart knew.",
  "Forever grateful for this.",
  "Little moments, big love.",
  "You + me = magic.",
  "This is us.",
  "Unforgettable.",
  "My favorite person.",
  "Every memory with you is a treasure.",
];

export function captionForIndex(index: number): string {
  return BASE_CAPTIONS[index % BASE_CAPTIONS.length];
}
