import { ApiProvider } from './../api/api.provider';
import { LocalStorageProvider } from './../local-storage/local-storage.provider';
import { MappingProvider } from './../mapping/mapping.provider';
import { Injectable } from '@angular/core';
import { NewNote } from '../../models/new-note';
import { AnnullaActivityModel } from '../../models/annulla-activity-model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ActivityModel } from '../../models/activity-model';
import { Constants } from '../../assets/constants/constants';

@Injectable()
export class ActivitiesProvider {

  constructor(private api: ApiProvider,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider) {
  }

  private activityListener = new Subject<any>();

  listenActivityListener(): Observable<any> {
    return this.activityListener.asObservable();
  }

  setActivityListener(data: ActivityModel) {
    this.activityListener.next(data);
  }

  async getActivityById(id: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_activity_by_id;
    url = url.replace('{id}', id.toString());

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

  async getInfoScannedPageData(userId: number, activityId: number) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_info_scanned_page_data;
    url = url.replace('{userId}', userId.toString()).replace('{activityId}', activityId.toString());

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

  // changing activity state for avvia and repristina
  async changeActivityState(userId: number, activityId: number, lavorazioneId: number, processPosition: number, operationType: string) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.change_activity_state;

    url = url.replace('{userId}', userId.toString()).replace('{activityId}', activityId.toString())
      .replace('{lavorazioneId}', lavorazioneId.toString()).replace('{processPosition}', processPosition.toString())
      .replace('{operationType}', operationType);

    return this.api.getAuth(url);
  }

  // changing activity state for termina, sospendi annulla only, because we are setting some additional values(note, minutes) in database and we use Post because of that
  async changeActivityStateTerminaSospendiAndAnnulla(data: AnnullaActivityModel) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.change_activity_state_annulla_and_termina;

    return this.api.postAuth(url, data);
  }

  // getting activities for scanned qr code of order, lavorazione or activity
  async getAllActivities(startRowIndex: number, maximumRows: number, userId: number, activityState: number, period: string, scannedId: string, scannerType: string) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_all_activities;

    url = url.replace('{startRowIndex}', startRowIndex.toString()).replace('{maximumRows}', maximumRows.toString())
      .replace('{userId}', userId.toString()).replace('{activityState}', activityState.toString())
      .replace('{period}', period).replace('{scannedId}', scannedId)
      .replace('{scannerType}', scannerType);

    return this.api.getAuth(url);
  }

   // getting all lavorazini
   async getAllLavorazioni(startRowIndex: number, maximumRows: number, userId: number, lavState: number, period: string) {
    // getting domain from local storage
    const domain = await this.localStorage.getItemFromLocalStorage(this.localStorage.domainNameInLocalStorage).then(domain => {
      return domain;
    });

    let url = domain + this.mapping.get_lav_list;

    url = url.replace('{startRowIndex}', startRowIndex.toString()).replace('{maximumRows}', maximumRows.toString())
      .replace('{userId}', userId.toString()).replace('{lavorazioniState}', lavState.toString()).replace('{period}', period);

    return this.api.getAuth(url);
  }

  // reusable method for getting of order id, lavorazione id or activity id
  async getScannedIdAndType(qrCode: string) {
    // if first character is 'o', it means we scanned order
    if (qrCode.charAt(0).toLowerCase() === 'o') {
      qrCode = qrCode.slice(1, qrCode.length);
      // if first character is 0, we should remove it
      if (qrCode.charAt(0) === '0') {
        // removing last 8 characters because they represend date of order, so later we can get orderId
        qrCode = qrCode.slice(1, qrCode.length - 8);
      }
      else {
        qrCode = qrCode.slice(0, qrCode.length - 8);
      }

      return { qr: qrCode, scannerType: Constants.ORDER };
    }
    // if first character is 'l', it means we scanned lavorazzione
    else if (qrCode.charAt(0).toLowerCase() === 'l') {
      qrCode = qrCode.slice(1, qrCode.length);
      // if first character is 0, we should remove it
      if (qrCode.charAt(0) === '0') {
        qrCode = qrCode.slice(1, qrCode.length);
      }

      return { qr: qrCode, scannerType: Constants.LAVORAZIONE };
    }
    // if first character is 'a', it means we scanned activity
    else if (qrCode.charAt(0).toLowerCase() === 'a') {
      qrCode = qrCode.slice(1, qrCode.length);

      // if first character is 0, we should remove it
      if (qrCode.charAt(0) === '0') {
        qrCode = qrCode.slice(1, qrCode.length);
      }

      return { qr: qrCode, scannerType: Constants.ACTIVITY };
    }
  }
}