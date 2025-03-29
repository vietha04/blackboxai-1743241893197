const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');
const auth = require('../middleware/auth');

// Get novel by ID
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bookmark a chapter
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    const { chapterId } = req.body;
    if (!chapterId || chapterId >= novel.chapters.length) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    // Update user's bookmarks (assuming user model has bookmarks array)
    req.user.bookmarks = req.user.bookmarks.filter(b => b.novel.toString() !== req.params.id);
    req.user.bookmarks.push({
      novel: req.params.id,
      chapter: chapterId,
      timestamp: Date.now()
    });

    await req.user.save();
    res.json({ message: 'Chapter bookmarked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reading progress
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const progress = req.user.readingProgress.find(
      p => p.novel.toString() === req.params.id
    );
    
    if (!progress) {
      return res.json({ progress: 0, lastChapter: 0 });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save reading progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { chapterId } = req.body;
    if (!chapterId) {
      return res.status(400).json({ message: 'Chapter ID is required' });
    }

    // Remove existing progress for this novel if exists
    req.user.readingProgress = req.user.readingProgress.filter(
      p => p.novel.toString() !== req.params.id
    );

    // Add new progress
    req.user.readingProgress.push({
      novel: req.params.id,
      lastChapter: chapterId,
      progress: ((chapterId + 1) / (await Novel.findById(req.params.id)).chapters.length) * 100,
      updatedAt: Date.now()
    });

    await req.user.save();
    res.json({ message: 'Progress saved successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;