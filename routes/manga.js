const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const Chapter = require('../models/Chapter');
const { ensureAuth, ensureRole } = require('../middleware/auth');

// @desc    Get all manga
// @route   GET /manga
router.get('/', async (req, res) => {
    try {
        let query = Manga.find();

        // Sorting
        if (req.query.sort === 'views') {
            query = query.sort({ views: -1 });
        } else {
            query = query.sort({ createdAt: -1 });
        }

        // Limiting
        if (req.query.limit) {
            query = query.limit(parseInt(req.query.limit));
        }

        const mangas = await query.populate('uploadedBy', 'displayName');
        res.json(mangas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get single manga
// @route   GET /manga/:id
router.get('/:id', async (req, res) => {
    try {
        // Find and increment views
        const manga = await Manga.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('uploadedBy', 'displayName');
        if (!manga) {
            return res.status(404).json({ error: 'Manga not found' });
        }
        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Create new manga
// @route   POST /manga
router.post('/', ensureAuth, ensureRole(['publisher', 'admin']), async (req, res) => {
    try {
        const newManga = {
            title: req.body.title,
            slug: req.body.slug, // In production, generate this automatically from title
            description: req.body.description,
            coverImage: req.body.coverImage,
            author: req.body.author,
            status: req.body.status,
            uploadedBy: req.user.id
        };

        const manga = await Manga.create(newManga);
        res.status(201).json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Get chapters for a manga
// @route   GET /manga/:id/chapters
router.get('/:id/chapters', async (req, res) => {
    try {
        const chapters = await Chapter.find({ mangaId: req.params.id }).sort({ chapterNumber: -1 });
        res.json(chapters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// @desc    Upload a chapter
// @route   POST /manga/:id/chapters
router.post('/:id/chapters', ensureAuth, ensureRole(['publisher', 'admin']), async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ error: 'Manga not found' });
        }

        const newChapter = {
            mangaId: req.params.id,
            title: req.body.title,
            chapterNumber: req.body.chapterNumber,
            pages: req.body.pages, // Array of URLs
            uploadedBy: req.user.id
        };

        const chapter = await Chapter.create(newChapter);

        // Update manga updatedAt
        manga.updatedAt = Date.now();
        await manga.save();

        res.status(201).json(chapter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
