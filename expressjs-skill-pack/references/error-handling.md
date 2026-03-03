# Error Handling & Logging

## Centralized Error Handler

\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  logger.error({ err, req });
  res.status(statusCode).json({ error: message });
});
\`\`\`

## Logging Best Practices
- Use structured logging (Winston, Pino)
- Log levels: error, warn, info, debug
- Include request IDs for tracing
- Never log sensitive data
