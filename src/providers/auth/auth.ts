import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../../models/login-form';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { MappingProvider } from '../mapping/mapping';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient,
    private localStorage: LocalStorageProvider,
    private mapping: MappingProvider) {
  }


  login(loginModel: LoginForm) {
    let response = this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      let url = domain + this.mapping.post_login;

      let token = this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        };

        loginModel.Password = btoa(loginModel.Password);

        return this.http.post(url, loginModel, httpOptions);
      });

      return token;
    });

    return response;
  }

  logout(): void {
    // this.localStorage.removeItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);
    // this.localStorage.removeItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.localStorage.clearLocalStorage();
  }

  isUserAuthentificated() {
    let isAuth = this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(token => {
      if (token != (undefined && null)) {
        let isUser = this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage).then(user => {
          if (user != (undefined && null)) {
            return true;
          }
          else {
            return false;
          }
        });

        return isUser;
      }
      else {
        return false;
      }
    });

    return isAuth;
  }

  getTokenFromServer(username: string, password: string,domain: string) {
    // let username = "Dynamicsoft";
    // let password = "Dynamicsoft2016";

    let data = "username=" + username + "&password=" + password + "&grant_type=password";
    let reqHeaders = new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' });

    //saving domain in local storage, so later we can reuse it for other requests
    let response = this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domainName => {
      return this.http.post(domain + this.mapping.token, data, { headers: reqHeaders });
    });

    return response;
  }
}
