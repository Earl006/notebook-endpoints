import { Request, Response } from 'express';
import NotesService from '../services/notes.service';

const notesService = new NotesService();

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    await notesService.createNote(title, content);
    res.status(201).json({ message: 'Note created' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await notesService.getAllNotes();
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const success = await notesService.deleteNote(id);
    if (success) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export const updateNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    const success = await notesService.updateNote(id, title, content);
    if (success) {
      res.json({ message: 'Note updated' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const note = await notesService.getNoteById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
