import { useState } from "react";

/**
 * Validation timing for a Form.Item: the first check runs when the user leaves the field
 * (no warning while they are still typing), after that it re-checks on every change,
 * so a warning disappears the moment the value becomes valid.
 *
 * Usage: spread `itemProps` on the Form.Item and `inputProps` on its input.
 */
export function useValidateAfterBlur() {
  const [blurred, setBlurred] = useState(false);

  return {
    blurred,
    itemProps: { validateTrigger: blurred ? ["onBlur", "onChange"] : "onBlur" },
    inputProps: { onBlur: () => setBlurred(true) },
  };
}
