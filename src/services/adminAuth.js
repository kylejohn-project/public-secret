const TOKEN_KEY =
  "publicSecretAdminToken";

const EXPIRY_KEY =
  "publicSecretAdminTokenExpiry";


export function saveAdminSession(
  token,
  expiresAt
) {
  sessionStorage.setItem(
    TOKEN_KEY,
    token
  );

  sessionStorage.setItem(
    EXPIRY_KEY,
    String(expiresAt)
  );
}


export function getAdminToken() {
  const token =
    sessionStorage.getItem(TOKEN_KEY);

  const expiresAt =
    Number(
      sessionStorage.getItem(
        EXPIRY_KEY
      )
    );

  if (
    !token ||
    !expiresAt ||
    Date.now() >= expiresAt
  ) {
    clearAdminSession();
    return null;
  }

  return token;
}


export function clearAdminSession() {
  sessionStorage.removeItem(
    TOKEN_KEY
  );

  sessionStorage.removeItem(
    EXPIRY_KEY
  );
}


export function isAdminAuthenticated() {
  return Boolean(
    getAdminToken()
  );
}