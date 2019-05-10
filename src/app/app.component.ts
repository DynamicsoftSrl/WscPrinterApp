import { LoginComponent } from './../pages/login/login';
import { AuthProvider } from '../providers/auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsMenuComponent } from './../components/tabs-menu/tabs-menu';

import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { ConfigProvider } from '../providers/config/config.provider';

@Component({
  templateUrl: 'app.html'
})
export class
  MyApp implements OnInit {


  rootPage: any;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AuthProvider,
    public translate: TranslateService,
    private appVersion: AppVersion,
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('it');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('it');

      this.getAppVersionNumber();
    });
  }

  ngOnInit(): void {
    this.auth.isUserAuthentificated().then(isAuth => {
      if (isAuth) {
        this.rootPage = TabsMenuComponent;
      }
      else {
        this.rootPage = LoginComponent;
      }
    });
  }

  /* checking which is version of this app and comparing it to a last version on google play */
  getAppVersionNumber() {
    this.appVersion.getVersionNumber().then(version => {
      this.getIonicAppNewestVersion(version);
    }
    );
  }

  /* get version of app which is active on google play,
     if the user doesn't have a latest update, we are showing an alert and closing application */
  getIonicAppNewestVersion(version: string) {
    this.configProvider.getIonicAppVersion().then($res => {
      $res.subscribe(response => {
        if (response !== version) {
          this.closeApplication();
        }
      },
        err => {
          // alert('error');
        });
    });
  }

  // showing a notification that user should get last version of app and closing application
  closeApplication() {
    const alert = this.alertCtrl.create({
      title: 'Avvertimento!',
      message: 'Si prega di aggiornare l\'app per continuare a utilizzare!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.platform.exitApp();
          }
        }]
    });
    alert.present();
  }
}
