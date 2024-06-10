import { config } from '../config/sql.config';
import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

export class NotesService {
  async createNote(title: string, content: string) {
    try {
      const pool = await sql.connect(config);
      const noteId = uuidv4(); 
      console.log(`Generated Note ID: ${noteId}`);
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, noteId)
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .query('INSERT INTO Notes (Id, Title, Content) OUTPUT INSERTED.Id VALUES (@id, @title, @content)');

      console.log(`Note created with ID: ${result.recordset[0].Id}`);
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
  }

  async getAllNotes() {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM Notes');
      console.log('Retrieved notes:', result.recordset);
      return result.recordset;
    } catch (err) {
      console.error('Error getting notes:', err);
      throw err;
    }
  }

  async deleteNote(id: string) {
    try {
      console.log(`Deleting note with ID: ${id}`);
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query('DELETE FROM Notes WHERE Id = @id');
        
      console.log(`Deleted note with ID: ${id}`);
      return result.rowsAffected[0] !== 0;
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  }

  async updateNote(id: string, title: string, content: string) {
    try {
      console.log(`Updating note with ID: ${id}`);
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .query('UPDATE Notes SET Title = @title, Content = @content WHERE Id = @id');
      
      console.log(`Updated note with ID: ${id}`);
      return result.rowsAffected[0] !== 0;
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  }

  async getNoteById(id: string) {
    try {
      console.log(`Retrieving note with ID: ${id}`);
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query('SELECT * FROM Notes WHERE Id = @id');
      
      console.log('Retrieved note:', result.recordset);
      if (result.recordset.length === 0) {
        return null;
      }

      return result.recordset[0];
    } catch (err) {
      console.error('Error getting note:', err);
      throw err;
    }
  }
}

export default NotesService;
