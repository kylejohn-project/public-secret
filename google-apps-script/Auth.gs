const ADMIN_SESSION_PREFIX = "ADMIN_SESSION_";


function adminLogin(username, password) {
  const properties =
    PropertiesService.getScriptProperties();

  const configuredUsername =
    properties.getProperty("ADMIN_USERNAME");

  const configuredPassword =
    properties.getProperty("ADMIN_PASSWORD");

  const sessionHours =
    Number(
      properties.getProperty(
        "ADMIN_SESSION_HOURS"
      )
    ) || 8;

  if (
    !configuredUsername ||
    !configuredPassword
  ) {
    throw new Error(
      "Admin authentication is not configured."
    );
  }

  if (
    String(username) !==
      String(configuredUsername) ||
    String(password) !==
      String(configuredPassword)
  ) {
    return jsonResponse({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const token =
    Utilities.getUuid() +
    Utilities.getUuid();

  const expiresAt =
    Date.now() +
    sessionHours * 60 * 60 * 1000;

  const session = {
    username: configuredUsername,
    expiresAt,
  };

  properties.setProperty(
    ADMIN_SESSION_PREFIX + token,
    JSON.stringify(session)
  );

  return jsonResponse({
    success: true,
    token,
    expiresAt,
  });
}


function validateAdminSession(token) {
  if (!token) {
    return false;
  }

  const properties =
    PropertiesService.getScriptProperties();

  const key =
    ADMIN_SESSION_PREFIX + token;

  const value =
    properties.getProperty(key);

  if (!value) {
    return false;
  }

  try {
    const session = JSON.parse(value);

    if (
      !session.expiresAt ||
      Date.now() > session.expiresAt
    ) {
      properties.deleteProperty(key);
      return false;
    }

    return true;

  } catch (error) {
    properties.deleteProperty(key);
    return false;
  }
}


function requireAdmin(token) {
  if (!validateAdminSession(token)) {
    throw new Error(
      "UNAUTHORIZED"
    );
  }
}


function adminLogout(token) {
  if (token) {
    PropertiesService
      .getScriptProperties()
      .deleteProperty(
        ADMIN_SESSION_PREFIX + token
      );
  }

  return jsonResponse({
    success: true,
  });
}


function adminSession(token) {
  return jsonResponse({
    success: true,
    authenticated:
      validateAdminSession(token),
  });
}