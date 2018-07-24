import { LoadingSpinnerProvider } from '../../providers/loading-spinner/loading-spinner.provider';
import { TabsMenuComponent } from './../../components/tabs-menu/tabs-menu';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage.provider';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { LoginForm } from '../../models/login-form';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { TokenModel } from '../../models/token-model';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from 'ionic-angular';
import { MappingProvider } from '../../providers/mapping/mapping.provider';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private localStorage: LocalStorageProvider,
    private mapping: MappingProvider,
    private spinner: LoadingSpinnerProvider,
  ) {
  }

  private sub: Subscription = new Subscription();

  public loginFormGroup: FormGroup;
  public model: LoginForm = new LoginForm();
  public isLoginError: boolean = false;
  public isDomainError: boolean = false;
  public isTokenCredentialsError: boolean = false;
  public isActiveIonicAppModule: boolean = true;

  private defaultProtocol: string = 'http://';
  private completeUrl: string = '';

  async ngOnInit() {
    //validation of login form via FormBuilder
    this.loginFormGroup = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      DomainPrefix: [this.defaultProtocol],
      Domain: ['', Validators.required]
    });

    this.setUserInputValues();
  }

  // If user logout, we want to set input values of login form. We are reading user data from local storage
  async setUserInputValues() {
    const userLocal = this.localStorage.loggedUserLocalStorage;
    const domainLocal = this.localStorage.domainNameInLocalStorage;
    const userStr = await this.localStorage.getItemFromLocalStorage(userLocal);

    if (userStr != null && userStr != undefined) {
      const userDetails: User = JSON.parse(userStr);

      const https = 'https://';

      let domainValue: string = await this.localStorage.getItemFromLocalStorage(domainLocal);

      // reading details from localstorage, and setting model values in DOM depending on details
      // spliting http/https from entire domain url
      if (domainValue != undefined && domainValue != null) {
        if (domainValue.indexOf(this.defaultProtocol) > -1) {
          domainValue = domainValue.split(this.defaultProtocol)[1];
        }

        if (domainValue.indexOf(https) > -1) {
          this.defaultProtocol = https;
          domainValue = domainValue.split(https)[1];
        }

        if (domainValue.indexOf(this.mapping.api) > -1) {
          domainValue = domainValue.split(this.mapping.api)[0];
        }

        this.model.Domain = domainValue;
      }

      this.model.Email = userDetails.Username;
    }
  }

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  async ionViewCanEnter() {
    const isAuth = await this.authProvider.isUserAuthentificated();

    if (isAuth) {
      this.navCtrl.setRoot(TabsMenuComponent);
    }

    return !isAuth;
  }

  //validation part getters for username, password and domain
  get email() {
    return this.loginFormGroup.get('Email');
  }

  get password() {
    return this.loginFormGroup.get('Password');
  }

  get domain() {
    return this.loginFormGroup.get('Domain');
  }

  onLogin() {
    this.showSpinnerLoader();
    this.checkDomain();
    this.setCompleteUrl();

    this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(tokenStorage => {
      // setting token url because we don't need  /api on localhost during development
      if (this.model.Domain.indexOf('localhost') > -1) {
        this.completeUrl = this.defaultProtocol + this.model.Domain;
      }

      this.localStorage.saveToLocalStorage(this.localStorage.domainNameInLocalStorage, this.completeUrl).then(res => {

        this.mapping.setDomain();

        if (tokenStorage == (null || undefined)) {
          this.getTokenAndLogin();
        }
        else {
          this.login();
        }
      });
    }
    ).catch(e => {
      console.log(e);
      this.hideSpinnerLoader();
    });
  }

  getTokenAndLogin() {
    const tokenCredentialsSub = this.localStorage.getTokenCredentialsFromJson()
      .subscribe(res => {
        const credentials = (res['credentials']);

        const username = credentials.username;
        const password = credentials.password;

        // setting token url because we don't need  /api on localhost during development
        let tokenUrl = '';

        if (this.model.Domain.indexOf('localhost') > -1) {
          tokenUrl = this.defaultProtocol + this.model.Domain;
        }
        else {
          tokenUrl = this.completeUrl;
        }

        this.authProvider.getTokenFromServer(username, password, tokenUrl)
          .then((response) => {
            const tokenSub = response.subscribe((token: TokenModel) => {
              this.localStorage.saveToLocalStorage(this.localStorage.tokenNameInLocalStorage, token.access_token)
                .then(token => {
                  this.login();
                });
            }, (err: HttpErrorResponse ) => {
              console.log(err.message);
              if (err.status == 400) {
                this.isTokenCredentialsError = true;
                console.log('Wrong credentials');
              }
              else if (err.status == 0) {
                this.isDomainError = true;
                console.log('Wrong domain');
              }
              else {
                this.isDomainError = true;
                console.log('Wrong domain test');
              }

              this.sub.add(tokenSub);

              this.hideSpinnerLoader();
            });
          });
      }, (err) => {
        this.handleError(err);
      });

    this.sub.add(tokenCredentialsSub);
  }

  login() {
    this.authProvider.login(this.model).then(login => {
      const userSub = login.subscribe((response: User) => {
        this.hideSpinnerLoader();

        if (response != null) {
          if (response.isActiveIonicAppModule) {
            this.isActiveIonicAppModule = true;
            this.isLoginError = false;

            const stringAdminUserObject = JSON.stringify(response);
            this.localStorage.saveToLocalStorage(this.localStorage.loggedUserLocalStorage, stringAdminUserObject).then(user => {
              this.navigateToCorrespondingPage(response);
            });
          }
          else {
            this.isActiveIonicAppModule = false;
            this.isLoginError = false;
            // if ionic app moduel is not active, remove token we get from server from local storage
            this.localStorage.removeItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);
          }
        }
        else {
          this.isLoginError = true;
          this.isActiveIonicAppModule = false;
          this.localStorage.removeItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);
        }
      }, (err: HttpErrorResponse) => {
        //handle if token has expired
        if (err.status == 401) {
          console.log(err.message);
          this.getTokenAndLogin();
        }
      });

      this.sub.add(userSub);
    }, err => { console.log(err); });
  }

  private handleError(err: HttpErrorResponse) {
    this.isLoginError = true;
    this.hideSpinnerLoader();
    console.log(err.message);
  }


  showSpinnerLoader(contentText?: string, spinnerType?: string) {
    this.spinner.showLoadingSpinner(contentText, spinnerType);
  }

  hideSpinnerLoader() {
    this.spinner.hideLoadingSpinner();
  }

  navigateToCorrespondingPage(userDetails: User) {
    this.navCtrl.setRoot(TabsMenuComponent);
  }

  removeValidators() {
    this.isLoginError = false;
    this.isDomainError = false;
    this.isTokenCredentialsError = false;
  }

  // check if domain's last character is not '/', if it is, remove it
  private checkDomain(): void {
    if (this.model.Domain.substring(this.model.Domain.length - 1) == '/') {
      this.model.Domain = this.model.Domain.substring(0, this.model.Domain.length - 1);
    }
  }

  // setting complete URL
  private setCompleteUrl(): void {
    if (this.model.DomainPrefix != undefined) {
      this.completeUrl = this.model.DomainPrefix + this.model.Domain + this.mapping.api;
    }
    else {
      this.completeUrl = this.defaultProtocol + this.model.Domain + this.mapping.api;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
