import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from '../mapping/mapping.provider';
import { LocalStorageProvider } from '../local-storage/local-storage.provider';

@Injectable()
export class ConfigProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider) {
  }

  async getIonicAppVersion() {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_last_version_of_app;

    return this.http.get(url);
  }
}
