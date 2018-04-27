import { TabsMenuComponent } from './../../components/tabs-menu/tabs-menu';
import { User } from './../../models/user-model';
import { ApiRoutesProvider } from './../../providers/api-routes/api-routes';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

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

  ngOnInit(): void {
    //validation of login form via FormBuilder
    this.loginFormGroup = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Domain: ['http://localhost:54171', Validators.required]
    });
  }

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  ionViewCanEnter() {
    let isAuth = this.authProvider.isUserAuthentificated().then(userIsAuthentificated => {
      return userIsAuthentificated;
    });

    return isAuth.then(value => {
      if (value == true) {
        //if user is logged in, we should redirect him to homepage
        this.navCtrl.setRoot(TabsMenuComponent);
      }
    });
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
    this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(tokenStorage => {
      this.localStorage.saveToLocalStorage(this.localStorage.domainNameInLocalStorage, this.model.Domain).then(res => {
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
    this.authProvider.getTokenFromServer(this.model.Domain).then((response) => {
      response.subscribe((token: TokenModel) => {
        this.localStorage.saveToLocalStorage(this.localStorage.tokenNameInLocalStorage, token.access_token).then(token => {
          this.apiRoutes.setDomain(this.model.Domain);

          this.login();
        })
      })
    }).catch(err => {
      //for example, if domain url is not well formated
      console.log(err);
    })
  }

  login() {
    this.authProvider.login(this.model).then(login => {
      login.subscribe((response: User) => {
        if (response != null) {
          this.isLoginError = false;

          let stringAdminUserObject = JSON.stringify(response);
          this.localStorage.saveToLocalStorage(this.localStorage.loggedUserLocalStorage, stringAdminUserObject).then(user => {
            this.navigateToHomepage(response);
          });
        }
        else {
          this.isLoginError = true;
        }
      }), err => {
        console.log(err);
      }
    }).catch(e => {
      console.log(e);

      this.handleError(e);
    }
    )
  }

  private handleError(err: HttpErrorResponse) {
    this.isLoginError = true;
    console.log(err.error.error_description);
  }

  navigateToHomepage(userDetails: User) {
    this.navCtrl.setRoot(TabsMenuComponent);
  }

  removeValidators() {
    this.isLoginError = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
