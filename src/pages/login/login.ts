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
    this.authProvider.getTokenFromServer(this.model.Domain)
      .subscribe((token: TokenModel) => {
        this.localStorage.saveToLocalStorage(this.localStorage.tokenNameInLocalStorage, token.access_token);
        this.apiRoutes.setDomain(this.model.Domain);

        this.authProvider.login(this.model).subscribe(response => {
          // this.navigateToHomepage();
        }),
          (err: HttpErrorResponse) => {
            this.isLoginError = true;
            console.log(err.error.error_description);
          }
      })
  }

  navigateToHomepage() {
    this.navCtrl.push(HomePage, { loginFormData: this.model })
      .then(x => {
        //removing option to return back to login page if user is already logged in
        this.navCtrl.remove(0, this.navCtrl.getActive().index);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
