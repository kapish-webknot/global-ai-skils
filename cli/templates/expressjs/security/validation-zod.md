# Zod - TypeScript-First Validation

## Why Zod?
- **Type safety** - Auto-generates TypeScript types
- **Zero dependencies** - Lightweight and fast
- **Composable** - Build complex schemas easily
- **Error messages** - Clear validation errors
- **Developer experience** - Intuitive API

## Installation
```bash
npm install zod
```

## Schema Definition
```typescript
import { z } from 'zod';

// User schema
export const UserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  age: z.number().int().positive().optional(),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number')
});

// Infer TypeScript type
export type User = z.infer<typeof UserSchema>;
```

## Express Middleware
```typescript
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };

// Usage
app.post('/users', validate(UserSchema), async (req, res) => {
  // req.body is validated and typed
  const user = req.body; // Type: User
  // ... create user
});
```

## Nested Objects
```typescript
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code')
});

const UserWithAddressSchema = UserSchema.extend({
  address: AddressSchema,
  shippingAddress: AddressSchema.optional()
});
```

## API Validation
```typescript
// Query params
const QuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100))
});

// Route params
const ParamsSchema = z.object({
  id: z.string().uuid()
});
```

## Best Practices
- Define schemas in separate files
- Reuse common schemas (email, password, etc.)
- Use transform() for type coercion
- Provide clear error messages
- Use strict() to disallow extra fields