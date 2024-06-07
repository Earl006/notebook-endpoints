import { Router } from 'express';
import { createNote, getAllNotes, deleteNote, updateNote, getNoteById } from '../controllers/note.controller';

const crudRouter = Router();

crudRouter.post('/new', createNote);
crudRouter.get('/all', getAllNotes);
crudRouter.get('/note/:id', getNoteById);
crudRouter.put('/update/:id', updateNote);
crudRouter.delete('/delete/:id', deleteNote);

export default crudRouter;
