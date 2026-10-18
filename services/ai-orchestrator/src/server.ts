import express from 'express';
import cors from 'cors';
import { generateCalculator } from './graph.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-orchestrator' });
});

// Generate calculator from prompt
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, imageUrl } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Prompt is required',
      });
    }

    const result = await generateCalculator(prompt, imageUrl);

    if (result.issues.length > 0 && !result.spec) {
      return res.status(400).json({
        ok: false,
        error: 'Failed to generate calculator',
        issues: result.issues,
      });
    }

    res.json({
      ok: true,
      data: {
        spec: result.spec,
        issues: result.issues,
      },
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error',
    });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`AI Orchestrator listening on port ${port}`);
});




