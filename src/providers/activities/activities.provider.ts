import { ApiProvider } from './../api/api.provider';
import { LocalStorageProvider } from './../local-storage/local-storage.provider';
import { MappingProvider } from './../mapping/mapping.provider';
import { Injectable } from '@angular/core';
import { NewNote } from '../../models/new-note';

@Injectable()
export class ActivitiesProvider {

  constructor(private api: ApiProvider,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider) {
  }

  async getAllActivities(startRowIndex: number, maximumRows: number, userId: number, stateNumber: number, period: string) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_all_activities;
    url = url.replace('{startRowIndex}', startRowIndex.toString())
      .replace('{maximumRows}', maximumRows.toString())
      .replace('{userId}', userId.toString())
      .replace('{activityState}', stateNumber.toString())
      .replace('{period}', period);

    return this.api.getAuth(url);
  }

  async getTechnicalData(orderId: number, lavorazioniId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_technical_data;
    url = url.replace('{orderId}', orderId.toString())
      .replace('{lavorazioniId}', lavorazioniId.toString());

    return this.api.getAuth(url);
  }

  async getInfoPageData(orderId: number, userId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_order_row;
    url = url.replace('{userId}', userId.toString()).replace('{orderId}', orderId.toString());

    return this.api.getAuth(url);
  }

  async getNotes(orderId: number, lavorazioneId: number, userId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_notes;
    url = url.replace('{userId}', userId.toString()).replace('{orderId}', orderId.toString()).replace('{lavorazioneId}', lavorazioneId.toString());

    return this.api.getAuth(url);
  }

  async addNote(data: NewNote) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.add_note;

    return this.api.postAuth(url, data);
  }

  async getOtherTabData(orderId: number, lavorazioneId: number, activityId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_other_tab_data;
    url = url.replace('{orderId}', orderId.toString()).replace('{lavorazioneId}', lavorazioneId.toString()).replace('{lavProcessId}', activityId.toString());

    return this.api.getAuth(url);
  }
}
