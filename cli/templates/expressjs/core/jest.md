# Jest - Testing Framework

## Setup (2 min)
```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
npx ts-jest config:init
```

## Unit Test
```typescript
import { UserService } from '@/services/user.service';

describe('UserService', () => {
  it('creates user', async () => {
    const mockRepo = { create: jest.fn().mockResolvedValue({ id: 1 }) };
    const service = new UserService(mockRepo as any);
    
    const result = await service.create({ email: 'test@test.com' });
    expect(result.id).toBe(1);
  });
});
```

## API Test
```typescript
import request from 'supertest';
import app from '@/app';

describe('POST /users', () => {
  it('creates user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@test.com' })
      .expect(201);
    
    expect(res.body).toHaveProperty('id');
  });
});
```

## Run
```bash
npm test                # All tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

**Key:** Mock dependencies, test behavior not implementation | **Tokens:** ~180