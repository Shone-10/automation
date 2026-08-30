import express from 'express';
import { suggestCategory, summarizeComplaint, classifyImage } from '../services/aiService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/categorize', async (req, res, next) => {
  const { description } = req.body;
  try {
    const category = await suggestCategory(description);
    res.json({ category });
  } catch (error) {
    next(error);
  }
});

router.post('/summarize', async (req, res, next) => {
  const { description } = req.body;
  try {
    const summary = await summarizeComplaint(description);
    res.json({ summary });
  } catch (error) {
    next(error);
  }
});

router.post('/image-classify', async (req, res, next) => {
  const { imageUrl } = req.body;
  try {
    const classification = await classifyImage(imageUrl);
    res.json({ classification });
  } catch (error) {
    next(error);
  }
});

export default router;
