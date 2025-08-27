export const getRandomColor = (id, dark = false) => {
  let colors;
  if (dark) {
    colors = [
      "#ca8a04", // dark yellow
      "#b91c1c", // dark red
      "#4338ca", // dark indigo
      "#065f46", // dark emerald
      "#9d174d", // dark pink
      "#6d28d9", // dark violet
      "#c2410c", // dark orange
      "#0f766e", // dark teal
      "#9f1239", // dark rose
      "#3f6212", // dark lime
      "#78350f", // dark amber
      "#831843", // dark fuchsia
    ];
  } else {
    colors = [
      "#fde68a",
      "#fca5a5",
      "#a5b4fc",
      "#6ee7b7",
      "#f9a8d4",
      "#c4b5fd",
      "#fdba74",
      "#99f6e4",
      "#fecaca",
      "#d9f99d",
      "#fcd34d",
      "#fbcfe8",
    ];
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getDarkRandomColor = (id) => {
  return null;
};
