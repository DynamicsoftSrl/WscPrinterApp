import { LoadingSpinnerProvider } from './../../providers/loading-spinner/loading-spinner';
import { TabsMenuComponent } from './../../components/tabs-menu/tabs-menu';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { LoginForm } from '../../models/login-form';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenModel } from '../../models/token-model';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController } from 'ionic-angular';
import { MappingProvider } from '../../providers/mapping/mapping';

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
    private spinner: LoadingSpinnerProvider
  ) {
  }

  private sub: Subscription = new Subscription();

  public loginFormGroup: FormGroup;
  public model: LoginForm = new LoginForm();
  public isLoginError: boolean = false;
  public isDomainError: boolean = false;
  public isTokenCredentialsError: boolean = false;

  ngOnInit(): void {
    //validation of login form via FormBuilder
    this.loginFormGroup = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Domain: ['', Validators.required]
    });
  }

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  async ionViewCanEnter() {
    const isAuth = await this.authProvider.isUserAuthentificated()

    if (isAuth) {
      this.navCtrl.setRoot(TabsMenuComponent);
    }

    return !isAuth;
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
    this.showSpinnerLoader();

    this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(tokenStorage => {
      this.localStorage.saveToLocalStorage(this.localStorage.domainNameInLocalStorage, this.model.Domain).then(res => {

        this.mapping.setDomain();

        if (tokenStorage == (null || undefined)) {
          this.getTokenAndLogin();
        }
        else {
          this.login();
        }
      })
    }
    ).catch(e => { console.log(e) })
  }

  getTokenAndLogin() {
    const tokenCredentialsSub = this.localStorage.getTokenCredentialsFromJson()
      .subscribe(res => {
        const credentials = (res['credentials']);

        const username = credentials.username;
        const password = credentials.password;

        this.authProvider.getTokenFromServer(username, password, this.model.Domain)
          .then((response) => {
            const tokenSub = response.subscribe((token: TokenModel) => {
              this.localStorage.saveToLocalStorage(this.localStorage.tokenNameInLocalStorage, token.access_token)
                .then(token => {
                  this.login();
                })
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
            })
          })
      }, (err) => {
        this.handleError(err);
      })

    this.sub.add(tokenCredentialsSub);
  }

  login() {
    this.authProvider.login(this.model).then(login => {
      const userSub = login.subscribe((response: User) => {
        this.hideSpinnerLoader();

        if (response != null) {
          this.isLoginError = false;

          const stringAdminUserObject = JSON.stringify(response);
          this.localStorage.saveToLocalStorage(this.localStorage.loggedUserLocalStorage, stringAdminUserObject).then(user => {
            this.navigateToCorrespondingPage(response);
          });
        }
        else {
          this.isLoginError = true;
        }
      }, (err: HttpErrorResponse) => {
        //handle if token has expired
        if (err.status == 401) {
          console.log(err.message);
          this.getTokenAndLogin();
        }
      })

      this.sub.add(userSub);
    }, err => { console.log(err) });
  }

  private handleError(err: HttpErrorResponse) {
    this.isLoginError = true;
    this.hideSpinnerLoader()
    console.log(err.message);
  }


  showSpinnerLoader(contentText?: string, spinnerType?: string) {
    this.spinner.showLoadingSpinner(contentText, spinnerType);
  }

  hideSpinnerLoader() {
    this.spinner.hideLoadingSpinner()
  }

  navigateToCorrespondingPage(userDetails: User) {
    this.navCtrl.setRoot(TabsMenuComponent);
  }

  removeValidators() {
    this.isLoginError = false;
    this.isDomainError = false;
    this.isTokenCredentialsError = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
