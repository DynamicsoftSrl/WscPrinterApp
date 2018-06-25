import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ActivityModel } from '../../models/activity-model';
import { PopoverComponent } from '../../components/popover/popover';


@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage implements OnInit {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    public alertCtrl: AlertController) {
  }

  public details: string = 'info';

  // getting activity details from parent-nav component
  public infoData: ActivityModel = this.navParams.data;

  ngOnInit(): void {
  }

  segmentChanged(ev: any) {
    // console.log(ev);
  }

  presentPopover(myEvent) {
    // initializing data for feeding popover
    const data = { 'popoverType': 'activity-details', 'allStates': ['Avvia', 'Sospendi', 'Termina', 'Ripristina', 'Annulla'] };

    const popover = this.popoverCtrl.create(PopoverComponent, data);

    popover.present({
      ev: myEvent
    });

    popover.onWillDismiss(selectedState => {

      if (selectedState != null) {
        // selected value from popover
        const selectedOption = selectedState.explicitOriginalTarget.data;
        this.showPrompt(selectedOption);
      }
    });
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
            console.log('Buy clicked');
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
            console.log('Cancel clicked');
            console.log(data);
          }
        },
        {
          text: 'CONFERMA',
          handler: data => {
            if (data[inputname] != '') {
              console.log(data[inputname]);
              console.log('Saved clicked');
            }
          }
        }
      ]
    });
    prompt.present();
  }

}
