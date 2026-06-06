export interface LoveStoryChapter {
  date: string;
  /** One line of continuous story per photo */
  paragraph: string;
}

const CHAPTER_LABELS = [
  "Where it began",
  "The first spark",
  "When I knew",
  "Little moments",
  "Your smile",
  "Adventures",
  "Hard days",
  "Why you matter",
  "Us together",
  "My favorite memories",
];

/**
 * One continuous love story — one line per photo.
 * Edit freely to personalize.
 */
export const LOVE_STORY_LINES: string[] = [
  "Before you, my world was quiet — I didn't know anything was missing until you arrived.",
  "The first time I really looked at you, something shifted inside my chest.",
  "You walked into my life without fanfare, and somehow that made it even more powerful.",
  "I didn't fall all at once — I fell in little pieces, in your voice and your kindness.",
  "Somewhere between our first talks and not wanting to leave, I knew this was the beginning of us.",
  "There is a happiness that feels too warm and too good to be true — that's how falling for you felt.",
  "I caught myself smiling at my phone, replaying things you said like they were treasures.",
  "I didn't say it out loud at first, but my heart was already choosing you.",
  "Every laugh and quiet moment was adding up to something I could no longer ignore.",
  "I was falling, and for once, falling felt like flying with you.",
  "People ask when you know — for me it was a hundred small moments becoming certainty.",
  "I knew when you remembered something I said once and brought it up weeks later.",
  "I knew when a bad day felt lighter simply because you existed in it.",
  "I knew when I started imagining you in my future without even trying.",
  "Loving you stopped feeling like a risk and started feeling like truth.",
  "The grand gestures are beautiful, but I always return to our little moments.",
  "The comfortable silences, the inside jokes — they belong only to us.",
  "Ordinary afternoons became my favorite luxury because you were in them.",
  "These photos are evidence that my life got warmer the day you arrived.",
  "I don't think you know what your smile does to me, even from far away.",
  "There are polite smiles — and then there is yours, real and unguarded.",
  "When you smile at me, I feel chosen, seen, and deeply loved.",
  "Every adventure with you is really about who I become when I'm beside you.",
  "We could be anywhere and it still feels like an adventure because you're there.",
  "My favorite moments are when we got lost, laughed too hard, and didn't want the night to end.",
  "With you, even going home feels like the soft ending to a beautiful chapter.",
  "Love is easy on bright days — you proved what remains when life gets heavy.",
  "On hard days you didn't ask me to be stronger — you simply stayed and listened.",
  "That kind of love is rare, and it made me love you even deeper.",
  "You matter because you make me want to be kinder, more patient, more present.",
  "You see parts of me I hid from everyone else and never ask me to shrink.",
  "If the world forgot my name but you remembered, I would still feel remembered.",
  "There is a version of us that lives in the quiet space between us — sacred and ours.",
  "I love who we are together: honest, chosen, and still finding each other.",
  "If I lined up my favorite memories, most of them would have your face in them.",
  "I love our loud laughs and our quiet nights where nothing happened except us.",
  "You showed me why small moments matter — and they shaped my idea of happiness.",
  "Loving you changed me because real love makes room to grow.",
  "You loved me in a way that helped me believe I deserve good things.",
  "Some of the best parts of us live in late nights when the world is asleep.",
  "Early mornings with you feel like warmth I never want to leave.",
  "Some days gratitude hits me all at once — for all of you, not just one moment.",
  "I am grateful I get to know you this closely, this honestly, this deeply.",
  "When I imagine the future, you are part of the architecture, not an accessory.",
  "I'm not afraid of tomorrow when I think of building it with you beside me.",
  "I've tried to measure how much I love you and failed — it keeps growing.",
  "I love you in loud moments and silent ones, always steady and chosen.",
  "Today is your birthday, and I want you to feel celebrated for who you are.",
  "You deserve joy, rest, and to feel loved completely without question.",
  "You are cherished beyond measure — you are mine, and happy birthday, my love.",
];

export function getLoveChapter(index: number): LoveStoryChapter {
  const line = LOVE_STORY_LINES[index % LOVE_STORY_LINES.length];
  const date = CHAPTER_LABELS[Math.floor(index / 5) % CHAPTER_LABELS.length];
  return { date, paragraph: line };
}

/** One line — paced for ~3.5–4.5s per slide including transitions */
export function getReadingDurationSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words > 22) return 4.5;
  if (words > 14) return 4;
  return 3.5;
}
