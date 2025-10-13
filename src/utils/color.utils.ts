/**
 * Adds opacity to a given Ant Design token color.
 * Supports HEX (#RRGGBB or #RGB), RGB, and HSL formats.
 *
 * @param color - Ant Design token color (e.g. token.colorPrimary)
 * @param opacity - Opacity from 0 to 1
 * @returns RGBA or HSLA color string
 */
export function withOpacity(color: string, opacity: number): string {
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be between 0 and 1");
  }

  // --- HEX ---
  if (color.startsWith("#")) {
    let r: number, g: number, b: number;

    if (color.length === 4) {
      // #RGB format
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      // #RRGGBB format
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else {
      throw new Error("Invalid HEX color format");
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // --- RGB ---
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  // --- HSL ---
  if (color.startsWith("hsl(")) {
    return color.replace("hsl(", "hsla(").replace(")", `, ${opacity})`);
  }

  throw new Error(`Unsupported color format: ${color}`);
}
