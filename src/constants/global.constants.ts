export const ProductName = "Learnify";

/**
 * Same password rule as the backend: at least 8 characters, with an uppercase letter,
 * a lowercase letter, a digit and a special character, and no character repeated 3 times in a row.
 */
export const PASSWORD_PATTERN =
  /^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*(.)\1\1).*$/;

/** Max avatar size accepted by the backend. */
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

/** Max bio length accepted by the backend. */
export const MAX_BIO_LENGTH = 200;
