import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../../models/login-form';
import { LocalStorageProvider } from '../local-storage/local-storage.provider';
import { MappingProvider } from '../mapping/mapping.provider';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient,
    private localStorage: LocalStorageProvider,
    private mapping: MappingProvider) {
  }


  login(loginModel: LoginForm) {
    const response = this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      const url = domain + this.mapping.post_login;

      const token = this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          })
        };

        const postLogin = new LoginForm();

        postLogin.Domain = loginModel.Domain;
        postLogin.Email = loginModel.Email;
        postLogin.Password = btoa(loginModel.Password);

        return this.http.post(url, postLogin, httpOptions);
      });

      return token;
    });

    return response;
  }

  logout(): void {
    this.localStorage.clearLocalStorage();
  }

  isUserAuthentificated() {
    const isAuth = this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage).then(token => {
      if (token != (undefined && null)) {
        const isUser = this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage).then(user => {
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

  getTokenFromServer(username: string, password: string, domain: string) {
    const data = 'username=' + username + '&password=' + password + '&grant_type=password';
    const reqHeaders = new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' });

    //saving domain in local storage, so later we can reuse it for other requests
    const response = this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domainName => {
      return this.http.post(domain + this.mapping.token, data, { headers: reqHeaders });
    });

    return response;
  }
}

