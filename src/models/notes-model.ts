import { LavNote } from './lav-note-model';

export class Notes {
    OrderNote: string;
    LavNotes:LavNote[];
    
    constructor(LavNotes: LavNote[]) {
        const lavNote = new LavNote();
        LavNotes.push(lavNote);
    }
}