export default {
    ENV: process.env.ENV || "development",
    DATABASE_URL: process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST: process.env.DATABASE_URL,
    DATABASE_URL_TEST: process.env.DATABASE_URL_TEST,
    MIDDLEWARE_LOGGER_FORMAT: process.env.MIDDLEWARE_LOGGER_FORMAT || "combined",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["0.0.0.0:5000"]
}
