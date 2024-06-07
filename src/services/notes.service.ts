import { config } from '../config/sql.config';
import sql from 'mssql';

export class NotesService {
  async createNote(title: string, content: string) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .query('INSERT INTO Notes (Title, Content) OUTPUT INSERTED.Id VALUES (@title, @content)');

      console.log(`Note created with ID: ${result.recordset[0].Id}`);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  }

  async getAllNotes() {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM Notes');
      return result.recordset;
    } catch (err) {
      console.error('Error getting notes:', err);
      return [];
    }
  }

  async deleteNote(id: string) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Notes WHERE Id = @id');

      return result.rowsAffected[0] !== 0;
    } catch (err) {
      console.error('Error deleting note:', err);
      return false;
    }
  }

  async updateNote(id: string, title: string, content: string) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .query('UPDATE Notes SET Title = @title, Content = @content WHERE Id = @id');

      return result.rowsAffected[0] !== 0;
    } catch (err) {
      console.error('Error updating note:', err);
      return false;
    }
  }

  async getNoteById(id: string) {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Notes WHERE Id = @id');

      if (result.recordset.length === 0) {
        return null;
      }

      return result.recordset[0];
    } catch (err) {
      console.error('Error getting note:', err);
      return null;
    }
  }
}

export default NotesService;
