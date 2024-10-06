export const prettifyString = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
    .trim() // Remove leading and trailing spaces
}
