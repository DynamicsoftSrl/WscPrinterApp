import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from 'ionic-angular';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit {

  @Input('content') content: any;
  public loggedInUser: User = new User();

  constructor(private localStorage: LocalStorageProvider,
    public menuCtrl: MenuController) {
  }

  ngOnInit(): void {
    this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage)
      .then(user => {
        this.loggedInUser = JSON.parse(user);
      });
  }

  closeMenu() {
    this.menuCtrl.close();
  }

}
