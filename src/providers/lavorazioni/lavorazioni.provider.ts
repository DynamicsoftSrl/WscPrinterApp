import { ApiProvider } from './../api/api.provider';
import { Injectable } from '@angular/core';
import { MappingProvider } from '../mapping/mapping.provider';
import { LocalStorageProvider } from '../local-storage/local-storage.provider';

@Injectable()
export class LavorazioniProvider {

  constructor(private api: ApiProvider,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider) {
  }

  async getInfoPageData(lavId: number, userId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_lav_list_info;
    url = url.replace('{userId}', userId.toString()).replace('{lavId}', lavId.toString());

    return this.api.getAuth(url);
  }
}
