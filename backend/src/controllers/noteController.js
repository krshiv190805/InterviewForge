const Note = require('../models/Note');

const getNotes = async (req, res, next) => {
  try {
    const { search, tag, isPinned } = req.query;
    const query = { user: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (isPinned) {
      query.isPinned = isPinned === 'true';
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.statusCode = 404;
      throw new Error('Note not found');
    }

    res.json({
      success: true,
      note
    });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned, problem } = req.body;

    if (!title || !content) {
      res.statusCode = 400;
      throw new Error('Please include a title and content');
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      problem: problem || null
    });

    res.status(201).json({
      success: true,
      note
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.statusCode = 404;
      throw new Error('Note not found');
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      note
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.statusCode = 404;
      throw new Error('Note not found');
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const togglePinNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.statusCode = 404;
      throw new Error('Note not found');
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      note
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote
};
