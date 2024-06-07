"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const sql_config_1 = require("../config/sql.config");
const mssql_1 = __importDefault(require("mssql"));
class NotesService {
    createNote(title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pool = yield mssql_1.default.connect(sql_config_1.config);
                const result = yield pool.request()
                    .input('title', mssql_1.default.NVarChar, title)
                    .input('content', mssql_1.default.NVarChar, content)
                    .query('INSERT INTO Notes (Title, Content) VALUES (@title, @content)');
                console.log(`Note created with ID: ${(_a = result.recordset[0]) === null || _a === void 0 ? void 0 : _a.id}`);
            }
            catch (err) {
                console.error('Error creating note:', err);
            }
        });
    }
    getAllNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield mssql_1.default.connect(sql_config_1.config);
                const result = yield pool.request().query('SELECT * FROM Notes');
                return result.recordset;
            }
            catch (err) {
                console.error('Error getting notes:', err);
                return [];
            }
        });
    }
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield mssql_1.default.connect(sql_config_1.config);
                const result = yield pool.request()
                    .input('id', mssql_1.default.Int, id)
                    .query('DELETE FROM Notes WHERE Id = @id');
                return result.rowsAffected[0] !== 0;
            }
            catch (err) {
                console.error('Error deleting note:', err);
                return false;
            }
        });
    }
    updateNote(id, title, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield mssql_1.default.connect(sql_config_1.config);
                const result = yield pool.request()
                    .input('id', mssql_1.default.Int, id)
                    .input('title', mssql_1.default.NVarChar, title)
                    .input('content', mssql_1.default.NVarChar, content)
                    .query('UPDATE Notes SET Title = @title, Content = @content WHERE Id = @id');
                return result.rowsAffected[0] !== 0;
            }
            catch (err) {
                console.error('Error updating note:', err);
                return false;
            }
        });
    }
    getNoteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield mssql_1.default.connect(sql_config_1.config);
                const result = yield pool.request()
                    .input('id', mssql_1.default.Int, id)
                    .query('SELECT * FROM Notes WHERE Id = @id');
                if (result.recordset.length === 0) {
                    return null;
                }
                return result.recordset[0];
            }
            catch (err) {
                console.error('Error getting note:', err);
                return null;
            }
        });
    }
}
exports.NotesService = NotesService;
exports.default = NotesService;
