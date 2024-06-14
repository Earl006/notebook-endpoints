export class Note {
    id?: string;
    title: string;
    content: string;
  
    constructor(title: string, content: string, id?: string) {
      this.title = title;
      this.content = content;
      this.id = id;
    }
  }