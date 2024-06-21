import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Note } from '../models/note.model';
import { catchError } from 'rxjs/operators';

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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/new`;
    const notePayload = JSON.stringify(note); 
    return this.http.post<Note>(url, notePayload, { headers });
  }

  updateNote(note: Note): Observable<any> {
    const lowercaseNote = {
      id: note.Id,
      title: note.Title,
      content: note.Content
    };
    return this.http.put(`${this.baseUrl}/update/${note.Id}`, lowercaseNote);
  }


  deleteNote(id: string): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }
}