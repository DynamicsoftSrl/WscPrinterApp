import { ApiProvider } from './../api/api.provider';
import { LocalStorageProvider } from './../local-storage/local-storage.provider';
import { MappingProvider } from './../mapping/mapping.provider';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivitiesProvider {

  constructor(private api: ApiProvider,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider) {
  }

  async getAllActivities(startRowIndex: number, maximumRows: number, userId: number, stateNumber: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_all_activities;
    url = url.replace('{startRowIndex}', startRowIndex.toString())
            .replace('{maximumRows}', maximumRows.toString())
            .replace('{userId}', userId.toString())
            .replace('{activityState}', stateNumber.toString());

    return this.api.getAuth(url);
  }

}
