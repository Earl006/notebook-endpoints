export class Note {
    Id?: string;
    Title: string;
    Content: string;
  
    constructor(Title: string, Content: string, Id?: string) {
      this.Title = Title;
      this.Content = Content;
      this.Id = Id;
    }
  }