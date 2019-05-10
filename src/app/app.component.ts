import { Subscription } from 'rxjs/Subscription';
import { LoginComponent } from './../pages/login/login';
import { AuthProvider } from '../providers/auth/auth.provider';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsMenuComponent } from './../components/tabs-menu/tabs-menu';

import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { ConfigProvider } from '../providers/config/config.provider';
import { GlobalErrorHandlerProvider } from '../providers/global-error-handler/global-error-handler';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {

  rootPage: any;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AuthProvider,
    public translate: TranslateService,
    private appVersion: AppVersion,
    private configProvider: ConfigProvider,
    private alertCtrl: AlertController,
    private errorService: GlobalErrorHandlerProvider,
    private network: Network) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('it');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('it');

      // text for showing alert notification that internet connection is not available
      const title = 'Avvertimento!';
      const message = 'Si prega di accendere la connessione internet per utilizzare l\'applicazione!';
      const text = 'OK';

      // check if phone has internet connection
      const isConnected = this.isConnected();
      if (!isConnected) {
        this.closeApplication(title, message, text);
      }

      // watch for a connection network, if the device lose a internet connection, 
      let disconnectSubscription$ = this.network.onDisconnect().subscribe(() => {
        alert('network was disconnected :-(');
        this.closeApplication(title, message, text);
      });

      this.sub.add(disconnectSubscription$);

      // this.getAppVersionNumber();
    });
  }

  private sub: Subscription = new Subscription();

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

  // check if user's phone has internet connection
  isConnected(): boolean {
    let conntype = this.network.type;
    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }

  // checking which is version of this app and comparing it to a last version on google play
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
          const title = 'Avvertimento!';
          const message = 'Si prega di aggiornare l\'app per continuare a utilizzare!';
          const text = 'OK';

          this.closeApplication(title, message, text);
        }
      },
        err => {
          this.errorService.showServerErrorAlert();
        });
    });
  }

  // showing a notification that user should get last version of app and closing application
  closeApplication(title, message, text) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: text,
          handler: () => {
            this.platform.exitApp();
          }
        }]
    });
    alert.present();
  }

  ngOnDestroy(): void {
    // stop disconnect watch
    this.sub.unsubscribe();
  }
}
