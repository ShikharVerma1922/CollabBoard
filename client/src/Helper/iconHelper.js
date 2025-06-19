export const getRandomColor = (id) => {
  const colors = [
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
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
