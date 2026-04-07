// Design tokens extracted from fly.io style guide
export const BG = '#191034';
export const BG_CARD = '#22183c';
export const BG_DARKER = '#0d0920';
export const TEXT = '#ffffff';
export const TEXT_MUTED = '#9698b6';
export const ACCENT = '#702cdd';
export const BORDER = 'rgba(91,33,182,0.125)';
export const SHADOW = '0 10px 30px rgba(91,33,182,0.12), 0 0 0 1px rgba(91,33,182,0.125)';

export const SERIF = 'Newsreader, Georgia, "Times New Roman", serif';
export const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
export const MONO = '"Geist Mono", "Fira Code", monospace';

// Shared Framer Motion variants
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const stagger = (delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren } },
});
