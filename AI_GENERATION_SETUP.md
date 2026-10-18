# AI Calculator Generation Setup

## ✅ What's Implemented

### LangGraph Orchestrator Service
- ✅ **State Graph** - Multi-step AI workflow
- ✅ **Prompt Parsing** - Extract calculator requirements from text
- ✅ **Spec Generation** - Create CalculatorSpec JSON
- ✅ **Validation** - Check spec completeness and correctness
- ✅ **Example Generation** - Auto-generate test examples
- ✅ **Express Server** - Standalone service on port 8787

### API Integration
- ✅ **Generation Endpoint** - `/api/ai/generate`
- ✅ **Authentication** - Requires user login
- ✅ **Error Handling** - Returns issues/warnings
- ✅ **Mobile Integration** - Create screen calls API

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd services/ai-orchestrator
pnpm install
```

### 2. Configure Environment

Create `.env` file:
```env
OPENAI_API_KEY="sk-your_openai_api_key"
PORT=8787
NODE_ENV="development"
```

### 3. Update Backend API

Add to `services/api/.env`:
```env
AI_ORCHESTRATOR_URL="http://localhost:8787"
```

### 4. Start Services

**Terminal 1 - AI Orchestrator:**
```bash
cd services/ai-orchestrator
pnpm dev
```

**Terminal 2 - Backend API:**
```bash
cd services/api
pnpm dev
```

**Terminal 3 - Mobile App:**
```bash
cd apps/mobile
pnpm start
```

## 🎯 How It Works

### Workflow Graph

```
START
  ↓
Parse Prompt (LLM extracts requirements)
  ↓
Validate Spec (Check completeness)
  ↓
┌─────────┴─────────┐
│                   │
Valid          Invalid
│                   │
↓                   ↓
Generate Examples   END
  ↓
END (Return spec)
```

### Example Prompt

```
"Create a calculator for beam deflection with inputs: 
length (m), load (N), Young's modulus (Pa), moment of inertia (m⁴). 
Output: deflection (m)"
```

### Generated Output

- Complete CalculatorSpec JSON
- All inputs with units and ranges
- Outputs with units
- Equations/formulas
- Examples with test data
- Category and tags

## 📝 API Usage

### Generate Calculator

```bash
POST /api/ai/generate
Authorization: Bearer <token>

{
  "prompt": "Create a calculator for Ohm's Law...",
  "imageUrl": "optional_image_url"
}
```

### Response

```json
{
  "ok": true,
  "data": {
    "spec": { /* CalculatorSpec */ },
    "issues": [] // Warnings or errors
  }
}
```

## 🚀 Next Steps

1. **Improve Prompt Engineering**:
   - Better system prompts
   - Few-shot examples
   - Formula recognition

2. **Add Image Support**:
   - OCR for handwritten formulas
   - Diagram analysis
   - Photo-to-calculator

3. **Enhance Validation**:
   - Dimensional analysis
   - Unit consistency checks
   - Formula syntax validation

4. **Add Feedback Loop**:
   - User corrections
   - Regeneration with fixes
   - Learning from edits

## 🐛 Troubleshooting

### "OpenAI API key not found"
- Check `.env` file exists
- Verify `OPENAI_API_KEY` is set
- Restart orchestrator service

### "Connection refused"
- Ensure orchestrator is running on port 8787
- Check `AI_ORCHESTRATOR_URL` in API `.env`
- Verify network/firewall settings

### "Generation failed"
- Check OpenAI API quota
- Verify prompt is clear and specific
- Check orchestrator logs for errors

## 📚 Resources

- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [CalculatorSpec Schema](../packages/calculator-spec/src/spec.ts)

---

**Status**: AI generation ready! Users can create calculators from natural language prompts. 🎉




