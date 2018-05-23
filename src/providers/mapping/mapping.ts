import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MappingProvider {

  constructor(public http: HttpClient,
    private storage: LocalStorageProvider
  ) {
  }

  public setDomain() {
    const domainName = this.storage.domainNameInLocalStorage;

    this.storage.getItemFromLocalStorage(domainName).then(res => {
      this.domain = res;
    })
  }

  public domain;

  readonly token = '/token';
  public get_token_api = this.token;
  public post_login = '/ionaccount/login';
  public get_shipment_details = '/ionbarcode/getshipmentdetails/{id}';
  public set_shipment_details = '/ionbarcode/setshipmentdetails';
}
