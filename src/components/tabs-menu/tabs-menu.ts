import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth.provider';
import { LoginComponent } from './../../pages/login/login';
import { DashboardPage } from '../../pages/dashboard/dashboard';

@Component({
  selector: 'tabs-menu',
  templateUrl: 'tabs-menu.html'
})
export class TabsMenuComponent {

  public homepage: any = DashboardPage;

  constructor(private authProvider: AuthProvider,
    private navCtrl: NavController
  ) {

  }
}
