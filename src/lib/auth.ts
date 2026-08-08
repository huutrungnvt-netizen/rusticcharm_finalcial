// Supabase Auth requires an email address, but this app only ever has one
// user who thinks of it as a plain username. This maps that username to a
// stable, deterministic internal email so the login form can stay a simple
// "Tài khoản" field.
const USERNAME_EMAIL_DOMAIN = "rusticcharm.local"

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${USERNAME_EMAIL_DOMAIN}`
}
