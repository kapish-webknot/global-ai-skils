# Jest - JavaScript Testing Framework

## Why Jest?
- **Zero config** - Works out of the box
- **Fast** - Parallelized test execution
- **Snapshot testing** - UI component testing
- **Code coverage** - Built-in coverage reports
- **Mocking** - Easy function and module mocking

## Installation
```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

## Configuration (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

## Unit Test Example
```typescript
import { UserService } from '@modules/users/services/user.service';
import { UserRepository } from '@modules/users/repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn()
    } as any;
    
    service = new UserService(repository);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { email: 'test@example.com', name: 'Test' };
      repository.create.mockResolvedValue({ id: 1, ...userData });

      const result = await service.createUser(userData);

      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual({ id: 1, ...userData });
    });

    it('should throw error if email exists', async () => {
      repository.findByEmail.mockResolvedValue({ id: 1 } as any);

      await expect(
        service.createUser({ email: 'test@example.com', name: 'Test' })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

## Integration Test Example
```typescript
import request from 'supertest';
import app from '@/app';
import { prisma } from '@core/database';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', name: 'Test User' })
      .expect(201);

    expect(res.body).toMatchObject({
      email: 'test@example.com',
      name: 'Test User'
    });
    expect(res.body).toHaveProperty('id');
  });

  it('should validate required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'invalid' })
      .expect(400);

    expect(res.body.error).toBeDefined();
  });
});
```

## Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Best Practices
- Isolate tests - Each test should be independent
- Use descriptive test names
- Mock external dependencies
- Aim for 80%+ code coverage
- Run tests in CI/CD pipeline
- Use `beforeEach` for test setup