import { LoginComponent } from './../pages/login/login';
import { AuthProvider } from './../providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsMenuComponent } from './../components/tabs-menu/tabs-menu';

import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class
  MyApp implements OnInit {


  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthProvider, private translate: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('it');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('it');
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
    })
  }
}
