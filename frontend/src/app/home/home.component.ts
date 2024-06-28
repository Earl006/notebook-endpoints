import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../models/note.model';
import { NoteService } from '../services/notes.service';
import { FormsModule } from '@angular/forms'; 
import { ReversePipe } from '../pipes/reverse.pipe';
import { NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule, ReversePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('overlay') overlayRef!: ElementRef;
  @ViewChild('noteEditModal') noteEditModalRef!: ElementRef;
  @ViewChild('editNoteForm') editNoteForm!: NgForm;

  showAddNoteModal = false;
  showEditNoteModal = false;
  showNoteDetails = false;
  notes: Note[] = [];
  selectedNote: Note | null = null;
  newNoteTitle: string = '';
  newNoteContent: string = '';
  editNoteTitle: string = '';
  editNoteContent: string = '';

  selectNoteForDetails(note: Note) {
    this.selectedNote = note;
    this.selectedNote.Title = note.Title;
    this.selectedNote.Content = note.Content;

    this.showNoteDetails = true;
  }
  constructor(private noteService: NoteService) { }
  ngOnInit() {
    this.getNotes();
  }
  
  getNotes() {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        console.log(notes);
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
      }
    });
  }
  convertKeysToLowercase(obj: { [key: string]: any }): { [key: string]: any } {
    const convertedObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        convertedObj[key.toLowerCase()] = obj[key];
      }
    }
    return convertedObj;
  }
  
  
  
  createNote(title: string, content: string) {
  if (title.trim() && content.trim()) {
    const newNote = this.convertKeysToLowercase({ Title: title, Content: content }) as Note;

    this.noteService.createNote(newNote).subscribe({
      next: (createdNote) => {
        console.log(`Note created with title: ${createdNote.Title} and content: ${createdNote.Content}`);
        this.notes.push(createdNote);
        this.showAddNoteModal = false;
        this.newNoteTitle = '';
        this.newNoteContent = '';
        this.getNotes();
      },
      error: (error) => {
        console.error('Error creating note:', error);
      }
    });
  } else {
    console.warn('Please enter a title and content for the new note.');
  }
}
  
  
  updateNote() {
    if (this.selectedNote) {
      const updatedNote: Note = {
        Id: this.selectedNote.Id,
        Title: this.editNoteTitle,
        Content: this.editNoteContent
      };
      console.log('Sending updated note:', updatedNote);
  
      this.noteService.updateNote(updatedNote).subscribe({
        next:(response) => {
          const index = this.notes.findIndex(n => n.Id === updatedNote.Id);
          
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
          this.showEditNoteModal = false;
        },
        error:(error) => {
          console.error('Error updating note:', error);
        }
    });
    } else {
      console.warn('Please select a note to update.');
    }
  }
 
  
  deleteNote(noteId: string) {
    this.noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.Id !== noteId);
        console.log('Note deleted successfully.');
        this.getNotes();
        
      },
      error: (error) => {
        console.error('Error deleting note:', error);
      }
  });
  }
  // ngAfterViewInit() {
  //   if (this.selectedNote) {
  //     this.editNoteTitle = this.selectedNote.Title;
  //     this.editNoteContent = this.selectedNote.Content;
  //   }
  // }
  selectNoteForEdit(note: Note) {
    this.selectedNote = note;
    this.editNoteTitle = note.Title;
    this.editNoteContent = note.Content;

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
    this.selectedNote = null; 
  }
}