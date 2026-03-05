# AI Context Window Guide 🎯

## Quick Reference

### Token Budget Summary
| Template Type | Per File | All 10 Core Files |
|---------------|----------|-------------------|
| **Core** (Recommended) | 90-180 tokens | ~1,200 tokens |
| **Standard** (Reference) | 400-800 tokens | ~6,000 tokens |

---

## 📦 What to Feed to AI

### **Option 1: Core Files Only (Recommended)**
✅ **Best for:** Implementation, quick answers  
✅ **Total:** ~1,200 tokens  
✅ **Use:** All `/core/` files fit easily in AI context

```
Include all core files:
- core/pino.md (150 tokens)
- core/helmet.md (120 tokens)
- core/cors.md (90 tokens)
- core/zod-validation.md (100 tokens)
- core/rate-limiting.md (120 tokens)
- core/jest.md (180 tokens)
- core/bullmq.md (150 tokens)
- core/prometheus.md (140 tokens)
- core/health-checks.md (110 tokens)
```

### **Option 2: Selective (For Large Codebases)**
✅ **Best for:** Specific features, debugging  
✅ **Total:** 300-600 tokens  
✅ **Use:** Pick only what you need

**Common Combinations:**

#### Implementing Logging + Monitoring
```
- core/pino.md (150 tokens)
- core/prometheus.md (140 tokens)
- core/health-checks.md (110 tokens)
Total: ~400 tokens
```

#### Setting Up Security
```
- core/helmet.md (120 tokens)
- core/cors.md (90 tokens)
- core/rate-limiting.md (120 tokens)
- core/zod-validation.md (100 tokens)
Total: ~430 tokens
```

#### Testing Setup
```
- core/jest.md (180 tokens)
Total: ~180 tokens
```

#### Async Jobs + Queue
```
- core/bullmq.md (150 tokens)
Total: ~150 tokens
```

### **Option 3: Reference Files (When Needed)**
⚠️ **Use only when:** You need deep understanding  
⚠️ **Total:** 400-800 tokens per file  
⚠️ **Note:** Don't send all at once

**When to use reference files:**
- Learning a new technology
- Complex configuration needed
- Troubleshooting specific issues
- Understanding best practices in depth

---

## 💡 Best Practices

### ✅ DO
- **Start with core files** - They have everything needed for implementation
- **Send 3-5 files max** - Keep context focused
- **Combine related files** - Security files together, monitoring together
- **Reference full docs** - Link to `/reference/` when AI needs details

### ❌ DON'T
- **Send all files at once** - Wastes tokens, confuses AI
- **Mix unrelated topics** - Keep context focused
- **Ignore token counts** - Monitor your context window usage
- **Send reference files first** - Start with core, escalate if needed

---

## 🎯 By Use Case

### **1. New Project Setup**
Feed to AI:
```
core/pino.md + core/helmet.md + core/cors.md + core/health-checks.md
= ~470 tokens
```

### **2. Adding Authentication**
Your own auth code + these files:
```
core/rate-limiting.md + core/zod-validation.md
= ~220 tokens
```

### **3. Production Deployment**
Feed to AI:
```
core/prometheus.md + core/health-checks.md + core/pino.md
= ~400 tokens
```

### **4. Async Job Processing**
Feed to AI:
```
core/bullmq.md + core/pino.md (for job logging)
= ~300 tokens
```

### **5. Testing Implementation**
Feed to AI:
```
core/jest.md + your code snippet
= ~180 tokens + your code
```

### **6. Full Stack Implementation**
All core files:
```
All 9 core files = ~1,200 tokens
Still fits comfortably in most AI contexts
```

---

## 📊 Token Math

### Example: Claude 3.5 Sonnet (200K context)
| Scenario | Token Usage | Remaining for Code |
|----------|-------------|-------------------|
| All core files | 1,200 (0.6%) | 198,800 |
| Selected 5 files | 600 (0.3%) | 199,400 |
| All reference files | 6,000 (3%) | 194,000 |

**Verdict:** Core files leave 99%+ context for your actual code!

---

## 🚀 Quick Start Commands

### **Ask AI with Core Files**
```
"Using these Express.js skill files, help me implement [feature]"
Attach: All /core/ files
```

### **Ask AI for Specific Feature**
```
"Using this logging setup, help me add structured logging"
Attach: core/pino.md only
```

### **Ask AI for Debugging**
```
"My rate limiter isn't working. Here's my code:"
Attach: core/rate-limiting.md + your code
```

---

## 📂 File Structure

```
Your Generated Pack/
├── CONTEXT_GUIDE.md          ← You are here
├── README.md                  ← Overview of your selected stack
├── core/                      ← AI-optimized (feed these to AI)
│   ├── pino.md               (150 tokens)
│   ├── helmet.md             (120 tokens)
│   ├── cors.md               (90 tokens)
│   ├── zod-validation.md     (100 tokens)
│   ├── rate-limiting.md      (120 tokens)
│   ├── jest.md               (180 tokens)
│   ├── bullmq.md             (150 tokens)
│   ├── prometheus.md         (140 tokens)
│   └── health-checks.md      (110 tokens)
└── references/                ← Detailed docs (human reference)
    └── [full documentation]
```

---

## 🎓 Pro Tips

1. **Start Small:** Begin with 1-2 core files, add more as needed
2. **Context Aware:** If AI seems confused, you may have too many files
3. **Iterative:** Start with core, reference detailed docs when stuck
4. **Combine Smart:** Security files together, observability together
5. **Monitor Usage:** Keep eye on token counts in your AI interface

---

## ⚡ Performance Impact

| Approach | Speed | Quality | Context Efficiency |
|----------|-------|---------|-------------------|
| Core files | Fast ⚡ | High ✅ | Excellent 🎯 |
| Reference files | Slow 🐌 | High ✅ | Poor ❌ |
| Mixed | Medium | High ✅ | Good 👍 |

**Recommendation:** Use core files for 90% of tasks, reference for deep dives.

---

**Generated by:** Global AI Skills CLI  
**Last Updated:** When you ran the CLI  
**Your Stack:** Check README.md for your selected technologies