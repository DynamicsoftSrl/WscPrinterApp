import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { Notes } from './../../../models/notes-model';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { LocalStorageProvider } from './../../../providers/local-storage/local-storage.provider';
import { Component, OnInit, Input } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { User } from '../../../models/user-model';
import { LavNote } from '../../../models/lav-note-model';
import { NewNote } from '../../../models/new-note';
import { HttpErrorResponse } from '@angular/common/http';
import { LavorazioniModel } from '../../../models/lavorazioni-model';
import { Constants } from '../../../assets/constants/constants';

@Component({
  selector: 'note-tab',
  templateUrl: 'note-tab.html'
})

export class NoteTabComponent implements OnInit {

  public orderNotes;

  constructor(
    private localStorage: LocalStorageProvider,
    private activitiesService: ActivitiesProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider
  ) {
  }

  @Input('activityInfo') activityInfo: ActivityModel;
  @Input('parentInfoType') parentInfoType: string;
  @Input('lavInfo') lavInfo: LavorazioniModel;
  
  public notes: Notes = new Notes([new LavNote()]);

  public newNote: string = '';
  private user: User;

  async ngOnInit() {
    this.getNotes();
  }

  // getting of order note and lavorazioni notes
  async getNotes() {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    // get user info and send user id and id of order to server, to get info about order
    const userStr = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);

    this.user = JSON.parse(userStr);

    let notes;
    
    if (this.parentInfoType == Constants.LAVORAZIONE) {
      if(this.lavInfo && this.lavInfo.id && this.lavInfo.idPrev)
      {
        notes = await this.activitiesService.getNotes(this.lavInfo.idPrev, this.lavInfo.id, this.user.UserId);
      }
    }
    else {
      notes = await this.activitiesService.getNotes(this.activityInfo.IdOrder, this.activityInfo.Id_Order_Dettail, this.user.UserId);
    }

    notes.map((notes: Notes) => {
      // splitting date and set its value without minutes and secunds, because pipe doesn't work on this string date
      notes.LavNotes.forEach(lavNote => {
        let stringDate = lavNote.DataNotaString;
        let lastIndex = stringDate.lastIndexOf(':');
        let val = lavNote.DataNotaString.slice(0, lastIndex);

        lavNote.DataNotaString = val;
      });

      return notes;
    })
      .subscribe((notes: Notes) => {
        this.notes = notes;

        // hide loading spinner
        this.spinner.hideLoadingSpinner();
      },
        (err: HttpErrorResponse) => {
          this.spinner.hideLoadingSpinner();

          this.errHandler.handleServerError(err);
        });
  }

  // creating new note
  async submitNote() {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    var objectData = new NewNote();

    objectData = this.getNoteObjData();

    let note$ = await this.activitiesService.addNote(objectData);

    note$.map((notes: LavNote[]) => {
      // splitting date and set its value without minutes and secunds, because pipe doesn't work on this string date
      notes.forEach(lavNote => {
        let stringDate = lavNote.DataNotaString;
        let lastIndex = stringDate.lastIndexOf(':');
        let val = lavNote.DataNotaString.slice(0, lastIndex);

        lavNote.DataNotaString = val;
      });

      return notes;
    }).subscribe((response: LavNote[]) => {
      this.notes.LavNotes = response;
      this.newNote = '';

      this.spinner.hideLoadingSpinner();
    }, 
    (err: HttpErrorResponse) => {
      this.spinner.hideLoadingSpinner();

      this.errHandler.handleServerError(err);
    });
  }

  getNoteObjData() {
    var objectData = new NewNote();

    // if parent component is lavorazione
    if (this.parentInfoType == Constants.LAVORAZIONE) {
      if(this.lavInfo && this.lavInfo.id && this.lavInfo.idPrev)
      {
        objectData.LavorazioneId = this.lavInfo.id;
      }
    }
    else {
      objectData.LavorazioneId = this.activityInfo.Id_Order_Dettail;
    }

    objectData.UserId = this.user.UserId;
    objectData.Note = this.newNote;

    return objectData;
  }
}
