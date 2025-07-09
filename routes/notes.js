const express = require('express');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');
const { authMiddleware } = require('../utils/authMiddleware');
const { getNoteFilePath } = require('../utils/fileHelpers');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const filename = `${Date.now()}.txt`;
  const filePath = getNoteFilePath(filename);

  fs.writeFileSync(filePath, content);
  const note = await Note.create({ title, filename, createdBy: req.userId });
  res.json(note);
});

router.get('/', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  const content = fs.readFileSync(getNoteFilePath(note.filename), 'utf-8');
  res.json({ note, content });
});

router.put('/:id', async (req, res) => {
  const { content } = req.body;
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  fs.writeFileSync(getNoteFilePath(note.filename), content);
  note.updatedAt = Date.now();
  await note.save();
  res.json(note);
});

router.patch('/:id/rename', async (req, res) => {
  const { newTitle } = req.body;
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  note.title = newTitle;
  await note.save();
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  fs.unlinkSync(getNoteFilePath(note.filename));
  await note.deleteOne();
  res.json({ success: true });
});

module.exports = router;