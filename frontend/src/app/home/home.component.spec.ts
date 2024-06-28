import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { NoteService } from '../services/notes.service';
import { Note } from '../models/note.model';
import { ReversePipe } from '../pipes/reverse.pipe';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let noteServiceSpy: jasmine.SpyObj<NoteService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NoteService', ['getNotes', 'createNote', 'updateNote', 'deleteNote']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HomeComponent, ReversePipe],
      declarations: [],
      providers: [
        { provide: NoteService, useValue: spy }
      ]
    }).compileComponents();

    noteServiceSpy = TestBed.inject(NoteService) as jasmine.SpyObj<NoteService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();

  });

  describe('Initialization', () => {
    it('should fetch notes on init', () => {
      const mockNotes: Note[] = [
        { Id: '1', Title: 'Note 1', Content: 'Content 1' },
        { Id: '2', Title: 'Note 2', Content: 'Content 2' }
      ];
      noteServiceSpy.getNotes.and.returnValue(of(mockNotes));

      component.ngOnInit();
      fixture.detectChanges();

      expect(noteServiceSpy.getNotes).toHaveBeenCalled();
      expect(component.notes).toEqual(mockNotes);
    });

    it('should handle error when fetching notes', () => {
      noteServiceSpy.getNotes.and.returnValue(throwError(() => new Error('Error fetching notes')));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(noteServiceSpy.getNotes).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error fetching notes:', jasmine.any(Error));
    });
  });

  describe('Note Operations', () => {
    it('should create a new note', fakeAsync(() => {
      const newNote: Note = { Id: '3', Title: 'New Note', Content: 'New Content' };
      noteServiceSpy.createNote.and.returnValue(of(newNote));
      spyOn(component, 'getNotes');

      component.createNote('New Note', 'New Content');
      tick();

      expect(noteServiceSpy.createNote).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'New Note', content: 'New Content' }));
      expect(component.showAddNoteModal).toBeFalse();
      expect(component.newNoteTitle).toBe('');
      expect(component.newNoteContent).toBe('');
      expect(component.getNotes).toHaveBeenCalled();
    }));

    it('should update a note', fakeAsync(() => {
      const updatedNote: Note = { Id: '1', Title: 'Updated Note', Content: 'Updated Content' };
      component.selectedNote = { Id: '1', Title: 'Old Note', Content: 'Old Content' };
      component.editNoteTitle = 'Updated Note';
      component.editNoteContent = 'Updated Content';
      noteServiceSpy.updateNote.and.returnValue(of({}));

      component.updateNote();
      tick();

      expect(noteServiceSpy.updateNote).toHaveBeenCalledWith(updatedNote);
      expect(component.showEditNoteModal).toBeFalse();
    }));

    it('should delete a note', fakeAsync(() => {
      const noteId = '1';
      noteServiceSpy.deleteNote.and.returnValue(of(undefined));
      spyOn(component, 'getNotes');

      component.deleteNote(noteId);
      tick();

      expect(noteServiceSpy.deleteNote).toHaveBeenCalledWith(noteId);
      expect(component.getNotes).toHaveBeenCalled();
    }));
  });

  describe('UI Interactions', () => {
    it('should toggle add note modal', () => {
      component.showAddNoteModal = false;
      component.toggleAddNoteModal();
      expect(component.showAddNoteModal).toBeTrue();

      component.toggleAddNoteModal();
      expect(component.showAddNoteModal).toBeFalse();
    });

    it('should toggle edit note modal', () => {
      component.showEditNoteModal = false;
      component.toggleEditNoteModal();
      expect(component.showEditNoteModal).toBeTrue();

      component.toggleEditNoteModal();
      expect(component.showEditNoteModal).toBeFalse();
    });

    it('should toggle note details', () => {
      component.showNoteDetails = false;
      component.selectedNote = { Id: '1', Title: 'Test', Content: 'Test' };
      component.toggleNoteDetails();
      expect(component.showNoteDetails).toBeTrue();
      expect(component.selectedNote).toBeNull();

      component.toggleNoteDetails();
      expect(component.showNoteDetails).toBeFalse();
    });

    it('should select a note for editing', () => {
      const note: Note = { Id: '1', Title: 'Test Note', Content: 'Test Content' };
      spyOn(component, 'toggleEditNoteModal');

      component.selectNoteForEdit(note);

      expect(component.selectedNote).toEqual(note);
      expect(component.editNoteTitle).toBe('Test Note');
      expect(component.editNoteContent).toBe('Test Content');
      expect(component.toggleEditNoteModal).toHaveBeenCalled();
    });

    it('should select a note for details', () => {
      const note: Note = { Id: '1', Title: 'Test Note', Content: 'Test Content' };

      component.selectNoteForDetails(note);

      expect(component.selectedNote).toEqual(note);
      expect(component.showNoteDetails).toBeTrue();
    });
  });

  describe('Template Interactions', () => {
    it('should fetch and display notes', () => {
      const mockNotes: Note[] = [
        { Id: '1', Title: 'Note 1', Content: 'Content 1' },
        { Id: '2', Title: 'Note 2', Content: 'Content 2' }
      ];
      noteServiceSpy.getNotes.and.returnValue(of(mockNotes));

      component.getNotes();
      fixture.detectChanges();

      expect(component.notes).toEqual(mockNotes);

      const noteElements = fixture.debugElement.queryAll(By.css('.note'));
      expect(noteElements.length).toBe(2);
      expect(noteElements[0].query(By.css('h3')).nativeElement.textContent).toContain('Note 1');
      expect(noteElements[1].query(By.css('h3')).nativeElement.textContent).toContain('Note 2');
    });

    it('should open add note modal when "Add a New Note" button is clicked', () => {
      const addNoteButton = fixture.debugElement.query(By.css('#add-note'));
      addNoteButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component.showAddNoteModal).toBeTrue();
      const addNoteForm = fixture.debugElement.query(By.css('#note-add'));
      expect(addNoteForm).toBeTruthy();
    });

    it('should open edit note modal when edit button is clicked', () => {
      const mockNote: Note = { Id: '1', Title: 'Test Note', Content: 'Test Content' };
      component.notes = [mockNote];
      fixture.detectChanges();

      const editButton = fixture.debugElement.query(By.css('.note button:first-child'));
      editButton.triggerEventHandler('click', { stopPropagation: () => {} });
      fixture.detectChanges();

      expect(component.showEditNoteModal).toBeTrue();
      expect(component.selectedNote).toEqual(mockNote);
      const editNoteForm = fixture.debugElement.query(By.css('#note-edit'));
      expect(editNoteForm).toBeTruthy();
    });

    it('should delete note when delete button is clicked', fakeAsync(() => {
      const mockNote: Note = { Id: '1', Title: 'Test Note', Content: 'Test Content' };
      component.notes = [mockNote];
      noteServiceSpy.deleteNote.and.returnValue(of(undefined));
      spyOn(component, 'getNotes');
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(By.css('.note button:last-child'));
      deleteButton.triggerEventHandler('click', { stopPropagation: () => {} });
      tick();

      expect(noteServiceSpy.deleteNote).toHaveBeenCalledWith('1');
      expect(component.getNotes).toHaveBeenCalled();
    }));

    it('should show note details when a note is clicked', () => {
      const mockNote: Note = { Id: '1', Title: 'Test Note', Content: 'Test Content' };
      component.notes = [mockNote];
      fixture.detectChanges();
    
      const noteElement = fixture.debugElement.query(By.css('.note'));
      noteElement.triggerEventHandler('click', null);
      fixture.detectChanges();
    
      expect(component.showNoteDetails).toBeTrue();
      expect(component.selectedNote).toEqual(mockNote);
      const noteDetailsElement = fixture.debugElement.query(By.css('.note-details'));
      expect(noteDetailsElement).toBeTruthy();
    });
    
  });
});
