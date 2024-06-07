"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoteById = exports.updateNote = exports.deleteNote = exports.getAllNotes = exports.createNote = void 0;
const notes_service_1 = __importDefault(require("../services/notes.service"));
const notesService = new notes_service_1.default();
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        yield notesService.createNote(title, content);
        res.status(201).json({ message: 'Note created' });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.createNote = createNote;
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield notesService.getAllNotes();
        res.json(notes);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAllNotes = getAllNotes;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const success = yield notesService.deleteNote(id);
        if (success) {
            res.json({ message: 'Note deleted' });
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteNote = deleteNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
        const success = yield notesService.updateNote(id, title, content);
        if (success) {
            res.json({ message: 'Note updated' });
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateNote = updateNote;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const note = yield notesService.getNoteById(id);
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).json({ message: 'Note not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getNoteById = getNoteById;
