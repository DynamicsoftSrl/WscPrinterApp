import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ActionSheetController } from 'ionic-angular';
import { ActivityModel } from '../../models/activity-model';
import { PopoverComponent } from '../../components/popover/popover';
import { AnnullaActivityModel } from '../../models/annulla-activity-model';

@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage implements OnInit {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    private activityService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  public details: string = 'info';

  // getting activity details from parent-nav component
  public infoData: ActivityModel = this.navParams.data;
  private user: User;

  async ngOnInit() {
    const userString = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.user = JSON.parse(userString);
  }

  // presentPopover(myEvent) {
  //   // initializing data for feeding popover
  //   const data = { 'popoverType': 'activity-details', 'allStates': ['Avvia', 'Sospendi', 'Termina', 'Ripristina', 'Annulla'] };

  //   const popover = this.popoverCtrl.create(PopoverComponent, data);

  //   popover.present({
  //     ev: myEvent
  //   });

  //   popover.onWillDismiss(selectedState => {

  //     if (selectedState != null) {
  //       // selected value from popover
  //       const selectedOption = selectedState.explicitOriginalTarget.data;
  //       this.showPrompt(selectedOption);
  //     }
  //   });
  // }

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
            console.log('Cancel clicked');
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
            console.log('cancel clicked' + selected);
          }
        },
        {
          text: 'CONFERMA',
          handler: data => {
            if (selected == 'Annulla') {
              if (data[inputname] != '') {
                this.annullaActivity(selected, data[inputname]);
              }
            }
            else if (selected == 'Termina') {
              // termina activity
            }
          }
        }
      ]
    });

    prompt.present();
  }

  async annullaActivity(type: string, note: string) {
    const userId = this.user.UserId;
    const activityId = this.infoData.Id_Processo_Lavorazione;
    const lavorazioneId = this.infoData.Id_Order_Dettail;
    const processPosition = this.infoData.PosizioneProcesso;

    // creating object for sending in post method
    var model = new AnnullaActivityModel();
    model.UserId = userId;
    model.ActivityId = activityId;
    model.LavorazioneId = lavorazioneId;
    model.ProcessPosition = processPosition;
    model.Note = note;

    if (type != '') {
      model.OperationType = type.toLowerCase();
    }

    const response$ = await this.activityService.annullaActivity(model);

    response$.subscribe(res => {
      console.log(res);
    });
  }

  async changeActivityState(data: string) {
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
            console.log('Avvia clicked');
            this.showPrompt('Avvia');
          }
        },
        {
          text: 'Sospendi',
          icon: 'pause',
          handler: () => {
            console.log('Sospendi clicked');
            this.showPrompt('Sospendi');
          }
        },
        {
          text: 'Termina',
          icon: 'checkmark',
          handler: () => {
            console.log('Termina clicked');
            this.showPrompt('Termina');
          }
        },
        {
          text: 'Ripristina',
          icon: 'swap',
          handler: () => {
            console.log('Rispristina clicked');
            this.showPrompt('Ripristina');
          }
        }, {
          text: 'Annulla',
          icon: 'alert',
          handler: () => {
            console.log('Annula clicked');
            this.showPrompt('Annulla');
          }
        }
      ]
    });

    actionSheet.present();
  }
}
