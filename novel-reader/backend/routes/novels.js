const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');

// Lấy danh sách truyện
router.get('/', async (req, res) => {
  try {
    const novels = await Novel.find();
    res.json(novels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy chi tiết truyện
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    res.json(novel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;