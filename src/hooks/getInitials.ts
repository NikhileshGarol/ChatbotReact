export function getInitials(name?: string): string {
  if (!name) return "U"; // default initial

  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 0) return "U";

  if (words.length === 1) {
    // Single word name, take first letter
    return words[0][0].toUpperCase();
  }

  // Multiple words, take first letter of first and last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
