# JWT Authentication

## Setup

\`\`\`javascript
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
\`\`\`

## Middleware

\`\`\`javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

## Best Practices
- Use strong secrets (32+ characters)
- Set appropriate expiration times
- Implement refresh tokens
- Store tokens securely on client
- Use HTTPS only
