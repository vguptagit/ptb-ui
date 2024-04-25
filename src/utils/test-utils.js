/**
 * Formats a test title by removing disallowed characters and ensuring it is not longer than 255 characters.
 * Also capitalizes the first letter of the title.
 *
 * @param {string} title - The title to be formatted.
 * @return {string} The formatted title.
 */
export const sanitizeTitle = title => {
  // Remove disallowed characters and ensure title is not longer than 255 characters
  const disallowedCharacters = /[<>:"/\\|?]/;
  title = title.replace(disallowedCharacters, '').slice(0, 255);

  // Capitalize the first letter of the title
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return title;
};
