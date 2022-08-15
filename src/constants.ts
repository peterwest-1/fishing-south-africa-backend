export const __prod__ = process.env.NODE_ENV === "production";

export const changePasswordPrefix = "changePassword:";
export const confirmAccountPrefix = "confirmAccount:";

export const userSessionIDPrefix = "userSess:";
export const redisSessionPrefix = "sess:";

export const TOKEN_EXPIRY = 1200; //20 minutes
export const COOKIE_NAME = "qid";
export const COOKIE_LENGTH = 1000 * 60 * 60 * 24 * 365;

export const APP_NAME = "Fishing South Africa";
export const FROM_EMAIL = `"Fishing South Africa 👻" <bob@backend.com>`;
