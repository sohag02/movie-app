export function slideInOut() {
  // Old page animation - subtle fade and slight upward movement
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateY(0)",
      },
      {
        opacity: 0.8,
        transform: "translateY(-10%)",
      },
    ],
    {
      duration: 300,
      easing: "ease-out",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    },
  );
  // New page animation - slides up from bottom
  document.documentElement.animate(
    [
      {
        transform: "translateY(100%)",
      },
      {
        transform: "translateY(0)",
      },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.2, 0.0, 0.0, 1.0)", // Mobile-like easing
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    },
  );
}
