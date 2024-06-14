import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../models/note.model';
import { NoteService } from '../services/notes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('overlay') overlayRef!: ElementRef;
  @ViewChild('noteEditModal') noteEditModalRef!: ElementRef;
  showAddNoteModal = false;
  showEditNoteModal = false;
  showNoteDetails = false;
  notes: Note[] = [];
  selectedNote: Note | null = null;
  constructor(private noteService: NoteService) { }
  ngOnInit() {
    this.getNotes();
  }
  
  getNotes() {
    this.noteService.getNotes().subscribe(
      (notes) => {
        this.notes = notes;
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
  }
  
  createNote(note: Note) {
    this.noteService.createNote(note).subscribe(
      (newNote) => {
        this.notes.push(newNote);
        this.showAddNoteModal = false;
      },
      (error) => {
        console.error('Error creating note:', error);
      }
    );
  }
  
  updateNote(note: Note) {
    this.noteService.updateNote(note).subscribe(
      (updatedNote) => {
        const index = this.notes.findIndex(n => n.id === updatedNote.id);
        if (index !== -1) {
          this.notes[index] = updatedNote;
        }
        this.showEditNoteModal = false;
      },
      (error) => {
        console.error('Error updating note:', error);
      }
    );
  }
  
  deleteNote(noteId: string) {
    this.noteService.deleteNote(noteId).subscribe(
      () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
      },
      (error) => {
        console.error('Error deleting note:', error);
      }
    );
  }
  
  selectNoteForEdit(note: Note) {
    this.selectedNote = note;
    this.toggleEditNoteModal();
  }
  toggleAddNoteModal() {
    this.showAddNoteModal = !this.showAddNoteModal;
  }

  toggleEditNoteModal() {
    this.showEditNoteModal = !this.showEditNoteModal;
  }

  toggleNoteDetails() {
    this.showNoteDetails = !this.showNoteDetails;
  }
}
