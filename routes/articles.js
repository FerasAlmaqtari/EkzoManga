const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { ensureAuth, ensureRole } = require('../middleware/auth');

// @desc    Get All Articles
// @route   GET /articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('author', 'displayName')
            .sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get Single Article
// @route   GET /articles/:id
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'displayName');

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Create New Article
// @route   POST /articles
// @access  Protected (Admin/Publisher)
router.post('/', ensureAuth, ensureRole(['admin', 'publisher']), async (req, res) => {
    try {
        const newArticle = {
            title: req.body.title,
            content: req.body.content,
            coverImage: req.body.coverImage,
            author: req.user.id
        };

        const article = await Article.create(newArticle);
        res.status(201).json(article);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
