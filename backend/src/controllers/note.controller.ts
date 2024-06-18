import { Request, Response } from 'express';
import NotesService from '../services/notes.service';

const notesService = new NotesService();

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    console.log(`Received note with title: ${title} and content: ${content}`); 
    await notesService.createNote(title, content);
    res.status(201).json({ message: 'Note created' });
  } catch (err: any) {
    console.error('Error creating note:', err);
    res.status(400).json({ message: err.message });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await notesService.getAllNotes();
    res.json(notes);
  } catch (err: any) {
    console.error('Error getting notes:', err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(`Received request to delete note with ID: ${id}`);
    const success = await notesService.deleteNote(id);
    if (success) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    console.log(`Received request to update note with ID: ${id}`);
    const success = await notesService.updateNote(id, title, content);
    if (success) {
      res.json({ message: 'Note updated' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(`Received request to get note with ID: ${id}`);
    const note = await notesService.getNoteById(id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (err: any) {
    console.error('Error getting note:', err);
    res.status(500).json({ message: err.message });
  }
};
