import { ApiRoutesProvider } from './../api-routes/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../../models/login-form';
import { LocalStorageProvider } from '../local-storage/local-storage';

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient,
    private localStorage: LocalStorageProvider,
    private apiRoutes: ApiRoutesProvider) {
  }


  login(loginModel: LoginForm) {
    let domain = this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage);

    let url = domain + this.apiRoutes.post_login;

    let token = 'Bearer ' + this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    loginModel.Password = btoa(loginModel.Password);

    return this.http.post(url, loginModel, httpOptions);
  }

  logout(): void {
    this.localStorage.removeItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);
  }

  isUserAuthentificated(): boolean {
    let isAuthentificated: boolean = true;
    let token = this.localStorage.getItemFromLocalStorage(this.localStorage.tokenNameInLocalStorage);

    if (!token) {
      isAuthentificated = false;
    }

    return isAuthentificated;
  }

  getTokenFromServer(domain: string) {
    let username = "Dynamicsoft";
    let password = "Dynamicsoft2016";

    let data = "username=" + username + "&password=" + password + "&grant_type=password";
    let reqHeaders = new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' });

    //saving domain in local storage, so later we can reuse it for other requests
    this.localStorage.saveToLocalStorage(this.localStorage.domainNameInLocalStorage, domain);

    return this.http.post(domain + this.apiRoutes.token, data, { headers: reqHeaders });
  }
}
