# Mongoose (MongoDB ODM)

## Setup

\`\`\`javascript
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
});
\`\`\`

## Schema Best Practices

\`\`\`javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ email: 1 });
export const User = mongoose.model('User', userSchema);
\`\`\`

## Tips
- Use indexes for frequently queried fields
- Enable timestamps
- Validate at schema level
- Use lean() for read-only queries
