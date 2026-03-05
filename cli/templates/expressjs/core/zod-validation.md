# Zod - TypeScript Validation

## Setup (1 min)
```bash
npm install zod
```

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional()
});

type User = z.infer<typeof UserSchema>; // Auto-typed!
```

## Express Middleware
```typescript
const validate = (schema: z.ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };

app.post('/users', validate(UserSchema), (req, res) => {
  // req.body is validated and typed
});
```

**Key:** Type-safe validation with auto-generated TypeScript types | **Tokens:** ~100