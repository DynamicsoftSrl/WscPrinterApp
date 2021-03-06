import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class LocalStorageProvider {

  constructor(public http: HttpClient,
    private storage: Storage) {
  }

  //localStorage variables(keys)
  readonly tokenNameInLocalStorage: string = 'token';
  readonly domainNameInLocalStorage: string = 'domain';
  readonly loggedUserLocalStorage: string = 'loggedUser';
  // **************************************************

  saveToLocalStorage(name: string, value: string) {
    return this.storage.set(name, value);
  }

  removeItemFromLocalStorage(name: string) {
    return this.storage.remove(name);
  }

  clearLocalStorage() {
    return this.storage.clear();
  }

  getItemFromLocalStorage(name: string) {
    return this.storage.get(name);
  }

  getDomain(): Promise<string> {
    return this.getItemFromLocalStorage(this.domainNameInLocalStorage);
  }

  getTokenCredentialsFromJson() {
    return this.http.get("assets/data/token-credentials.json")
  }
}
