import { LoadingSpinnerProvider } from './../../providers/loading-spinner/loading-spinner.provider';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { ActivityModel } from '../../models/activity-model';
import { AnnullaActivityModel } from '../../models/annulla-activity-model';

@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage implements OnInit {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private activityService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    public actionSheetCtrl: ActionSheetController,
    private spinner: LoadingSpinnerProvider,
  ) {
  }

  public details: string = 'info';

  // getting activity details from parent-nav component
  public infoData: ActivityModel = this.navParams.data;
  private user: User;

  // details that we need for changing activity state, we need them in multiple methods, so they are created globally
  private userId: number;
  private activityId: number = this.infoData.Id_Processo_Lavorazione;
  private lavorazioneId: number = this.infoData.Id_Order_Dettail;
  private processPosition: number = this.infoData.PosizioneProcesso;

  async ngOnInit() {
    const userString = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.user = JSON.parse(userString);

    this.userId = this.user.UserId;
  }

  // configuring coresponding prompt depending on clicked item from popover
  showPrompt(data: string) {
    if (data == 'Avvia') {
      // adding image in title because alert controller is receiveing content as html
      const title = '<img src="../../assets/imgs/avvia.png" class="popover-title-icon" /><span class="popover-title-text">Avvia attività</span>';

      const message = 'Vuoi avviare quest\'attività?';

      this.confirmAlert(data, title, message);
    }
    else if (data == 'Sospendi') {
      const title = '<img src="../../assets/imgs/sospendi.png" class="popover-title-icon" /><span class="popover-title-text">Sospendi attività</span>';

      const message = 'Vuoi sospendere quest\'attività?';

      this.confirmAlert(data, title, message);
    }
    else if (data == 'Termina') {
      const title = '<img src="../../assets/imgs/termina.png" class="popover-title-icon" /><span class="popover-title-text">Termina attività</span>';
      const message = 'Vuoi terminare quest\'attività?';
      const inputName = 'minutes';
      const placeholder = 'Totale minuti impiegati';

      this.confirmTextAlert(data, title, message, inputName, placeholder, 'number');
    }
    else if (data == 'Ripristina') {
      const title = '<img src="../../assets/imgs/ripristina.png" class="popover-title-icon" /><span class="popover-title-text">Ripristina attività</span>';

      const message = 'Vuoi ripristinare quest\'attività?';

      this.confirmAlert(data, title, message);
    }
    else if (data == 'Annulla') {
      const title = '<img src="../../assets/imgs/annulla.png" class="popover-title-icon" /><span class="popover-title-text">Annulla attività</span>';

      const message = 'Vuoi annullare quest\'attività?';
      const inputName = 'note';
      const placeholder = 'Note';

      this.confirmTextAlert(data, title, message, inputName, placeholder, 'text');
    }
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

    const response$ = await this.activityService.changeActivityStateTerminaAndAnnulla(model);

    response$.subscribe(res => {
      console.log(res);
      if (res) {
        this.details = 'log';
        this.spinner.hideLoadingSpinner();

      }
      else {
        this.spinner.hideLoadingSpinner();
        this.showAlert();
      }
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

    const response$ = await this.activityService.changeActivityStateTerminaAndAnnulla(model);

    response$.subscribe(res => {
      console.log(res);
      if (res) {
        this.details = 'log';

        this.spinner.hideLoadingSpinner();
      }
      else {
        this.spinner.hideLoadingSpinner();

        this.showAlert();
      }
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
      console.log(x);
      if (x) {
        this.details = 'log';

        this.spinner.hideLoadingSpinner();
      }
      else {
        this.spinner.hideLoadingSpinner();

        this.showAlert();
      }
    });
  }

  // navigate to previous page
  goBack() {
    this.navCtrl.pop();
  }

  // show action sheet, and then after click on some item, show prompt, and if user confirm his decision, change state of activity
  showActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Azioni',
      buttons: [
        {
          text: 'Avvia',
          icon: 'play',
          handler: () => {
            this.showPrompt('Avvia');
          }
        },
        {
          text: 'Sospendi',
          icon: 'pause',
          handler: () => {
            this.showPrompt('Sospendi');
          }
        },
        {
          text: 'Termina',
          icon: 'checkmark',
          handler: () => {
            this.showPrompt('Termina');
          }
        },
        {
          text: 'Ripristina',
          icon: 'swap',
          handler: () => {
            this.showPrompt('Ripristina');
          }
        }, {
          text: 'Annulla',
          icon: 'alert',
          handler: () => {
            this.showPrompt('Annulla');
          }
        }
      ]
    });

    actionSheet.present();
  }

  // show alert if activity's state is not changed successfully
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Some error occured!',
      subTitle: 'Your action is not successfully done. Please try later.',
      buttons: ['OK']
    });
    alert.present();
  }
}
