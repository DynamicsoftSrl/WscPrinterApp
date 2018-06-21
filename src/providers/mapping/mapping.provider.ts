import { LocalStorageProvider } from '../local-storage/local-storage.provider';
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
    });
  }

  public domain;

  readonly token = '/token';
  public get_token_api = this.token;
  public api = '/api';
  public post_login = '/ionaccount/login';
  public get_shipment_details = '/ionbarcode/getshipmentdetails/{id}';
  public set_shipment_details = '/ionbarcode/setshipmentdetails';
  public get_all_activities = '/ionactivity/getallactivities/{startRowIndex}/{maximumRows}/{userId}/{activityState}/{period}';
  public get_technical_data = '/ionactivity/gettechnicaldata/{orderId}/{lavorazioniId}';
  public get_order_row = '/ionactivity/getinfopagedata/{userId}/{orderId}';
  public get_notes = '/ionactivity/getnotes/{userId}/{orderId}/{lavorazioneId}';
  public add_note = '/ionactivity/addlavnota';
  public get_other_tab_data = '/ionactivity/getothertabdata/{orderId}/{lavorazioneId}/{lavProcessId}';
}