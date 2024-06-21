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

  updateNote(note: Note): Observable<Note> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/update/${note.Id}`;
    console.log(note.Id);
    
    return this.http.put<Note>(url, note, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }


  deleteNote(id: string): Observable<void> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url);
  }
}