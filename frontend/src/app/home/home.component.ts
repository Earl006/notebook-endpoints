import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Note } from '../models/note.model';
import { NoteService } from '../services/notes.service';
import { FormsModule } from '@angular/forms'; 
import { ReversePipe } from '../pipes/reverse.pipe';
import { NgForm } from '@angular/forms';

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
    this.showNoteDetails = true;
  }
  constructor(private noteService: NoteService) { }
  ngOnInit() {
    this.getNotes();
  }
  
  getNotes() {
    this.noteService.getNotes().subscribe(
      (notes) => {
        this.notes = notes;
        console.log(notes);
        
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
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
    // if (this.newNoteTitle.trim() && this.newNoteContent.trim()) {
      if (title.trim() && content.trim()) {
      // const newNote = { Title: this.newNoteTitle, Content: this.newNoteContent } as Note;
      // console.log('Sending note:', newNote); // Debug log
      // const newNote = { Title: title, Content: content } as Note;
      const newNote = this.convertKeysToLowercase({ Title: title, Content: content }) as Note;

      this.noteService.createNote(newNote).subscribe(
        (createdNote) => {
          console.log(`Note created with title: ${createdNote.Title} and content: ${createdNote.Content}`);
          this.notes.push(createdNote);
          this.showAddNoteModal = false;
          this.newNoteTitle = '';
          this.newNoteContent = '';
          this.getNotes();
        },
        (error) => {
          console.error('Error creating note:', error);
        }
      );
    } else {
      console.warn('Please enter a title and content for the new note.');
    }
  }
  
  
  updateNote() {
    if (this.selectedNote) {
      const updatedNote = {
        ...this.selectedNote,
        Title: this.editNoteTitle,
        Content: this.editNoteContent
      };
  
      this.noteService.updateNote(updatedNote).subscribe(
        (response) => {
          const index = this.notes.findIndex(n => n.Id === updatedNote.Id);
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
          this.showEditNoteModal = false;
        },
        (error) => {
          console.error('Error updating note:', error);
        }
      );
    }else{
      console.warn('Please select a note to update.');
    
    }
  }
  
  deleteNote(noteId: string) {
    this.noteService.deleteNote(noteId).subscribe(
      () => {
        this.notes = this.notes.filter(note => note.Id !== noteId);
        console.log('Note deleted successfully.');
        this.getNotes();
        
      },
      (error) => {
        console.error('Error deleting note:', error);
      }
    );
  }
  ngAfterViewInit() {
    if (this.selectedNote) {
      this.editNoteTitle = this.selectedNote.Title;
      this.editNoteContent = this.selectedNote.Content;
    }
  }
  selectNoteForEdit(note: Note) {
    this.selectedNote = { ...note };
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