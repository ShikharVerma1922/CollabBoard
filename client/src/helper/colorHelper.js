export function isColorDark(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return false;

  let c = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // Relative luminance formula
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128; // true if dark
}

export function adjustColor(hex, amount = 20) {
  let c = hex.startsWith("#") ? hex.slice(1) : hex;
  if (c.length === 3) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  let r = Math.min(255, Math.max(0, parseInt(c.substring(0, 2), 16) + amount));
  let g = Math.min(255, Math.max(0, parseInt(c.substring(2, 4), 16) + amount));
  let b = Math.min(255, Math.max(0, parseInt(c.substring(4, 6), 16) + amount));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
