// Design tokens as Tailwind class strings.
// Panels and fields are square with thick ink borders. Speech elements (buttons, chips) are round.
// Yellow is reserved for the main action. Text is 16px on fields so iOS does not zoom on focus.

export const panelClass = "border-2 border-ink bg-bubble";

export const fieldClass =
  "w-full border-2 border-ink bg-bubble px-4 py-3 text-base text-ink placeholder:text-muted";

export const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-ink bg-sfx px-6 py-2.5 font-black text-ink shadow-[3px_3px_0_0_#15151A] transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-ink bg-bubble px-6 py-2.5 font-bold text-ink transition hover:bg-sfx";
