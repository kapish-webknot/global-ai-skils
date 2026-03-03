# Project Structure

## Recommended Directory Layout

\`\`\`
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── validators/      # Input validation
└── app.js           # Express app setup
\`\`\`

## Best Practices
- Separate concerns (routes → controllers → services → models)
- Keep controllers thin, services fat
- Use dependency injection
- Centralize configuration
- Implement proper error boundaries
