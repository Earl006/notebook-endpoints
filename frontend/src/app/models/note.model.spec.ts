import { Note } from './note.model';

describe('Note', () => {
  it('should create an instance', () => {
    const note = new Note('Test Title', 'Test Content');
    expect(note).toBeTruthy();
  });

  it('should set title and content correctly', () => {
    const title = 'Test Title';
    const content = 'Test Content';
    const note = new Note(title, content);
    expect(note.Title).toBe(title);
    expect(note.Content).toBe(content);
  });

  it('should set id if provided', () => {
    const id = '123';
    const note = new Note('Test Title', 'Test Content', id);
    expect(note.Id).toBe(id);
  });

  it('should have undefined id if not provided', () => {
    const note = new Note('Test Title', 'Test Content');
    expect(note.Id).toBeUndefined();
  });
});