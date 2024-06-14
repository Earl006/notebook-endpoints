import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private baseUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note[]> {
    const url = `${this.baseUrl}/all`;
    return this.http.get<Note[]>(url);
  }

  getNote(id: string): Observable<Note> {
    const url = `${this.baseUrl}/note/${id}`;
    return this.http.get<Note>(url);
  }

  createNote(note: Note): Observable<Note> {
    const url = `${this.baseUrl}/new`;
    return this.http.post<Note>(url, note);
  }

  updateNote(note: Note): Observable<Note> {
    const url = `${this.baseUrl}/update/${note.id}`;
    return this.http.put<Note>(url, note);
  }

  deleteNote(id: string): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }
}