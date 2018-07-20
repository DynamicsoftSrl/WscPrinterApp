import { DashboardPage } from './../dashboard/dashboard';
import { GlobalErrorHandlerProvider } from './../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../providers/loading-spinner/loading-spinner.provider';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { ActivityModel } from '../../models/activity-model';
import { AnnullaActivityModel } from '../../models/annulla-activity-model';
import { HttpErrorResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage implements OnInit {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private activityService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    public actionSheetCtrl: ActionSheetController,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider,
    private alertCtrl: AlertController
  ) {
  }

  public details: string = 'info';

  // getting activity details from parent-nav component
  public infoData: ActivityModel = this.navParams.data;
  private user: User;

  public scannedActivityId: number = this.navParams.data.activityId;

  // details that we need for changing activity state, we need them in multiple methods, so they are created globally
  private userId: number;
  private activityId: number = this.infoData.Id_Processo_Lavorazione;
  private lavorazioneId: number = this.infoData.Id_Order_Dettail;
  private processPosition: number = this.infoData.PosizioneProcesso;

  async ngOnInit() {
    const userString = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.user = JSON.parse(userString);

    this.userId = this.user.UserId;

    if (this.scannedActivityId) {
      this.getActivityFromServer(this.scannedActivityId);
    }
  }

  async getActivityFromServer(activityId?: number) {
    const id = activityId != undefined ? activityId : this.activityId;

    const activity$ = await this.activityService.getActivityById(id);

    activity$.subscribe((res: ActivityModel) => {
      this.infoData = res;
      this.activityService.setActivityListener(res);

      // if scanned activity is not assigned to logged in user, show alert and redirect him to homepage
      if (this.infoData.IdOperatori != null && this.infoData.IdOperatori != undefined) {
        if (!this.infoData.IdOperatori.includes(this.userId.toString())) {
          this.activityNotAssignedToLoggedClientAlert();
        }
      }
      else {
        this.activityNotAssignedToLoggedClientAlert();
      }
    });
  }

  // configuring coresponding prompt depending on clicked item from popover
  showPrompt(data: string) {
    if (data == 'Avvia') {
      // adding image in title because alert controller is receiveing content as html
      const title = '<img src="assets/imgs/avvia.png" class="popover-title-icon" /><span class="popover-title-text">Avvia attività</span>';

      const message = 'Vuoi avviare quest\'attività?';

      this.confirmAlert(data, title, message);
    }
    else if (data == 'Sospendi') {
      const title = '<img src="assets/imgs/sospendi.png" class="popover-title-icon" /><span class="popover-title-text">Sospendi attività</span>';

      const message = 'Vuoi sospendere quest\'attività?';
      const inputName = 'note';
      const placeholder = 'Note';

      this.confirmTextAlert(data, title, message, inputName, placeholder, 'text');
    }
    else if (data == 'Termina') {
      const title = '<img src="assets/imgs/termina.png" class="popover-title-icon" /><span class="popover-title-text">Termina attività</span>';
      const message = 'Vuoi terminare quest\'attività?';
      const inputName = 'minutes';
      const placeholder = 'Totale minuti impiegati';

      this.confirmTextAlert(data, title, message, inputName, placeholder, 'number');
    }
    else if (data == 'Ripristina') {
      const title = '<img src="assets/imgs/ripristina.png" class="popover-title-icon" /><span class="popover-title-text">Ripristina attività</span>';

      const message = 'Vuoi ripristinare quest\'attività?';

      this.confirmAlert(data, title, message);
    }
    else if (data == 'Annulla') {
      const title = '<img src="assets/imgs/annulla.png" class="popover-title-icon" /><span class="popover-title-text">Annulla attività</span>';

      const message = 'Vuoi annullare quest\'attività?';
      const inputName = 'note';
      const placeholder = 'Note';

      this.confirmTextAlert(data, title, message, inputName, placeholder, 'text');
    }
  }

  activityNotAssignedToLoggedClientAlert() {
    const alert = this.alertCtrl.create({
      title: 'Warning!',
      message: 'Non puoi avviare o terminare un\'attività se quella precedente è in corso, in lavorazione o in sospensione!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.push(DashboardPage);
          }
        }]
    });
    alert.present();
  }

  // confirm alert for avvia, ripristina and sospendi actions
  confirmAlert(selected: string, title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'ANNULLA',
          role: 'cancel',
          cssClass: 'color-red',
          handler: () => {
          }
        },
        {
          text: 'CONFERMA',
          handler: () => {
            this.changeActivityState(selected);
          }
        }
      ]
    });
    alert.present();
  }

  // confirm alert with aditional input field only for annulla and termina actions
  confirmTextAlert(selected: string, title: string, message: string, inputname: string, placeholder: string, type: string) {
    const prompt = this.alertCtrl.create({
      title: title,
      message: message,
      inputs: [
        {
          name: inputname,
          placeholder: placeholder,
          type: type
        },
      ],
      buttons: [
        {
          text: 'ANNULLA',
          cssClass: 'color-red',
          handler: data => {
          }
        },
        {
          text: 'CONFERMA',
          handler: data => {
            if (selected == 'Annulla') {
              // annulla activity
              if (data[inputname] != '') {
                this.annullaActivity(selected, data[inputname]);
              }
            }
            else if (selected == 'Termina') {
              // termina activity
              if (data[inputname] != '') {
                this.terminaActivity(selected, data[inputname]);
              }
            }
            else if (selected == 'Sospendi') {
              // sospendi activity
              if (data[inputname] != '') {
                this.sospendiActivity(selected, data[inputname]);
              }
            }
          }
        }
      ]
    });

    prompt.present();
  }

  async terminaActivity(type: string, minutes: number) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    // creating object for sending in post method
    var model = new AnnullaActivityModel();
    model.UserId = this.userId;
    model.ActivityId = this.activityId;
    model.LavorazioneId = this.lavorazioneId;
    model.ProcessPosition = this.processPosition;
    model.ConsuntivoTempoTotale = minutes;

    if (type != '') {
      model.OperationType = type.toLowerCase();
    }

    const response$ = await this.activityService.changeActivityStateTerminaSospendiAndAnnulla(model);

    response$.subscribe(res => {
      console.log(res);
      this.getActivityFromServer();

      if (res) {
        this.details = 'log';
        this.spinner.hideLoadingSpinner();

      }
      else {
        this.spinner.hideLoadingSpinner();
        this.showAlert();
      }
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.showAlert(err);
      });
  }

  async annullaActivity(type: string, note: string) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    // creating object for sending in post method
    var model = new AnnullaActivityModel();
    model.UserId = this.userId;
    model.ActivityId = this.activityId;
    model.LavorazioneId = this.lavorazioneId;
    model.ProcessPosition = this.processPosition;
    model.Note = note;

    if (type != '') {
      model.OperationType = type.toLowerCase();
    }

    const response$ = await this.activityService.changeActivityStateTerminaSospendiAndAnnulla(model);

    response$.subscribe(res => {
      console.log(res);
      this.getActivityFromServer();

      if (res) {
        this.details = 'log';

        this.spinner.hideLoadingSpinner();
      }
      else {
        this.spinner.hideLoadingSpinner();

        this.showAlert();
      }
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.showAlert(err);
      });
  }

  async sospendiActivity(type: string, note: string) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    // creating object for sending in post method
    var model = new AnnullaActivityModel();
    model.UserId = this.userId;
    model.ActivityId = this.activityId;
    model.LavorazioneId = this.lavorazioneId;
    model.ProcessPosition = this.processPosition;
    model.Note = note;

    if (type != '') {
      model.OperationType = type.toLowerCase();
    }

    const response$ = await this.activityService.changeActivityStateTerminaSospendiAndAnnulla(model);

    response$.subscribe(res => {
      console.log(res);
      this.getActivityFromServer();

      if (res) {
        this.details = 'log';
        this.spinner.hideLoadingSpinner();

      }
      else {
        this.spinner.hideLoadingSpinner();
        this.showAlert();
      }
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.showAlert(err);
      });
  }

  async changeActivityState(data: string) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    const userId = this.user.UserId;
    const activityId = this.infoData.Id_Processo_Lavorazione;
    const lavorazioneId = this.infoData.Id_Order_Dettail;
    const processPosition = this.infoData.PosizioneProcesso;

    let operationType = '';

    if (data != '') {
      operationType = data.toLowerCase();
    }

    const activityState$ = await this.activityService.changeActivityState(userId, activityId, lavorazioneId, processPosition, operationType);

    activityState$.subscribe(x => {
      this.getActivityFromServer();
      if (x) {
        this.details = 'log';

        this.spinner.hideLoadingSpinner();
      }
      else {
        this.spinner.hideLoadingSpinner();

        this.showAlert();
      }
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.showAlert(err);
      });
  }

  // navigate to previous page
  goBack() {
    this.navCtrl.pop();
  }

  // show action sheet, and then after click on some item, show prompt, and if user confirm his decision, change state of activity
  showActionSheet() {
    const actionButtons = this.controllActions();

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Azioni',
      buttons: actionButtons
    });

    actionSheet.present();
  }

  // set all actions depending on Stato_Processo
  controllActions() {
    let actionButtons = [];
    if (this.infoData.Stato_Processo === 0 || this.infoData.Stato_Processo === 4) {
      actionButtons.push({
        text: 'Avvia',
        icon: 'play',
        handler: () => {
          this.showPrompt('Avvia');
        }
      });
    }

    if (this.infoData.Stato_Processo === 1) {
      actionButtons.push({
        text: 'Sospendi',
        icon: 'pause',
        handler: () => {
          this.showPrompt('Sospendi');
        }
      }
      );
    }

    if (this.infoData.Stato_Processo === 0 || this.infoData.Stato_Processo === 1) {
      actionButtons.push({
        text: 'Termina',
        icon: 'checkmark',
        handler: () => {
          this.showPrompt('Termina');
        }
      },
        {
          text: 'Annulla',
          icon: 'alert',
          handler: () => {
            this.showPrompt('Annulla');
          }
        }
      );
    }

    if (this.infoData.Stato_Processo === 1 || this.infoData.Stato_Processo === 3) {
      actionButtons.push({
        text: 'Ripristina',
        icon: 'swap',
        handler: () => {
          this.showPrompt('Ripristina');
        }
      }
      );
    }

    return actionButtons;
  }

  // show alert if activity's state is not changed successfully
  showAlert(err?: HttpErrorResponse) {
    this.errHandler.handleServerError(err);
  }
}
