import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiRoutesProvider {

  constructor(public http: HttpClient,
    private localStorage: LocalStorageProvider) {
  }

  // //getting domain from local storage, because it is dynamically, and it is inserted during the logging into application
  // private getDomain() {
  //   let domainStorageName = this.localStorage.domainNameInLocalStorage;
  //   let domain = this.localStorage.getItemFromLocalStorage(domainStorageName);

  //   return domain;
  // }

  public setDomain(domainUrl: string) {
    this.domain = domainUrl;
  }

  public domain;

  readonly token = "/token";
  public get_token_api = this.token;
  public post_login = "/ionaccount/login";

}
