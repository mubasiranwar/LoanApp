import { isAxiosError } from "axios";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_MESSAGE =
  "Unable to reach the server. Check your connection and try again.";

// One place to turn any error into text we can show the user.
export function getErrorMessage(error, fallback = DEFAULT_MESSAGE) {
  const apiMessage = error?.response?.data?.message;
  if (apiMessage) return apiMessage;

  if (error?.code === "ERR_NETWORK") return NETWORK_MESSAGE;

  // Plain Errors we throw ourselves have readable messages; raw axios ones don't.
  if (!isAxiosError(error) && error?.message) return error.message;

  return fallback;
}
