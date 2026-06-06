const BASE_MEMORIES = [
  "You probably don't remember this.",
  "But I do ❤️",
  "This moment stayed with me.",
  "I think about this more than you know.",
  "You made me feel so seen.",
  "This is when I knew.",
  "A quiet moment I'll never forget.",
  "You didn't know I was falling.",
  "This laugh — I'll cherish forever.",
  "Small moment, huge impact.",
  "I saved this memory in my heart.",
  "You were perfect that day.",
  "Still my favorite version of us.",
];

export function memoryForIndex(index: number): string {
  return BASE_MEMORIES[index % BASE_MEMORIES.length];
}
