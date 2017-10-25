export default {
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.NODE_ENV === "test" ? process.env.DATABASE_URL_TEST: process.env.DATABASE_URL,
    DATABASE_URL_TEST: process.env.DATABASE_URL_TEST,
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    PLACEHOLDER_URL: process.env.PLACEHOLDER_URL || "http://insideoutproject.xyz/mulheres-palestrantes/img/placeholder-female.jpg",
    CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN || "*"
}
