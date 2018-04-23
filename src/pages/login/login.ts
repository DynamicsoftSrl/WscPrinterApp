import { User } from './../../models/user-model';
import { ApiRoutesProvider } from './../../providers/api-routes/api-routes';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { HomePage } from './../home/home';
import { LoginForm } from '../../models/login-form';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenModel } from '../../models/token-model';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private localStorage: LocalStorageProvider,
    private apiRoutes: ApiRoutesProvider
  ) {
  }

  private sub: Subscription = new Subscription();

  public loginFormGroup: FormGroup;
  public model: LoginForm = new LoginForm();
  public isLoginError: boolean = false;
  private isAuthentificated: boolean = false;

  ngOnInit(): void {
    //validation of login form via FormBuilder
    this.loginFormGroup = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Domain: ['http://localhost:54171', Validators.required]
    });
  }

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  ionViewCanEnter(): boolean {
    this.isAuthentificated = this.authProvider.isUserAuthentificated();

    if (this.isAuthentificated)
      this.navCtrl.setRoot(HomePage);

    return true;
  }

  //validation part getters for username, password and domain
  get email() {
    return this.loginFormGroup.get('Email')
  }

  get password() {
    return this.loginFormGroup.get('Password')
  }

  get domain() {
    return this.loginFormGroup.get('Domain')
  }

  onLogin() {
    if (!this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage)) {
      this.getTokenAndLogin();
    }
    else {
      this.login();
    }
  }

  getTokenAndLogin() {
    this.authProvider.getTokenFromServer(this.model.Domain)
      .subscribe((token: TokenModel) => {
        this.localStorage.saveToLocalStorage(this.localStorage.tokenNameInLocalStorage, token.access_token);
        this.apiRoutes.setDomain(this.model.Domain);

        this.login();
      }),
      (err: HttpErrorResponse) => {
        this.handleError(err);
      }
  }

  login() {
    this.authProvider.login(this.model).subscribe((response: User) => {
      if (response != null) {
        this.isLoginError = false;

        let stringAdminUserObject = JSON.stringify(response);
        this.localStorage.saveToLocalStorage(this.localStorage.loggedUserLocalStorage, stringAdminUserObject);

        this.navigateToHomepage(response);
      }
      else {
        this.isLoginError = true;
      }
    }),
      (err: HttpErrorResponse) => {
        this.handleError(err);
      }
  }

  private handleError(err: HttpErrorResponse) {
    this.isLoginError = true;
    console.log(err.error.error_description);
  }

  navigateToHomepage(userDetails: User) {
    this.navCtrl.push(HomePage, { UserDetails: userDetails })
      .then(x => {
        //removing option to return back to login page if user is already logged in
        this.navCtrl.remove(0, this.navCtrl.getActive().index);
      });
  }

  removeValidators() {
    this.isLoginError = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
