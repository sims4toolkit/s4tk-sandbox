/**
 * Converts a string in hyphen case (like-this) to camel case (likeThis).
 * 
 * @param hyphenCase String in hyphen case
 */
export function hyphenToCamel(hyphenCase: string): string {
  const pascalCase = hyphenCase?.split("-")
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1)
}
