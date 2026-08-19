export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "That email and password combination doesn't match an account. Double-check and try again.";
  }
  if (m.includes("email not confirmed")) {
    return "This account still needs email confirmation. Try signing up again or contact support.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "An account with this email already exists — try logging in instead.";
  }
  if (m.includes("password should be at least") || m.includes("password is too short")) {
    return "Password must be at least 6 characters.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts right now. Please wait a moment and try again.";
  }
  if (m.includes("invalid email") || m.includes("unable to validate email")) {
    return "Please enter a valid email address.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "We couldn't reach the server. Check your connection and try again.";
  }
  return message || "Something went wrong. Please try again.";
}
