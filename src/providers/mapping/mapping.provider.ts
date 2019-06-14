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
  public update_shipment_details = '/ionbarcode/updateshipmentdetails/{id}/{attribute}/{value}';
  public get_activity_by_id= '/ionactivity/getactivitybyid/{id}';
  public get_technical_data = '/ionactivity/gettechnicaldata/{orderId}/{lavorazioniId}';
  public get_order_row = '/ionactivity/getinfopagedata/{userId}/{orderId}';
  public get_info_scanned_page_data = '/ionactivity/getinfoscannedpagedata/{userId}/{activityId}';
  public get_notes = '/ionactivity/getnotes/{userId}/{orderId}/{lavorazioneId}';
  public add_note = '/ionactivity/addlavnota';
  public get_other_tab_data = '/ionactivity/getothertabdata/{orderId}/{lavorazioneId}/{lavProcessId}';
  public change_activity_state = '/ionactivity/changeactivitystate/{userId}/{activityId}/{lavorazioneId}/{processPosition}/{operationType}';
  public change_activity_state_annulla_and_termina = '/ionactivity/changeactivitystate';
  public get_all_activities = '/ionactivity/getactivities/{startRowIndex}/{maximumRows}/{userId}/{activityState}/{period}/{scannedId}/{scannerType}';
  public get_lav_list = '/ionlav/getlavorazionilist/{startRowIndex}/{maximumRows}/{userId}/{lavorazioniState}/{period}';
  public get_lav_list_info = '/ionlav/getlavorazioniinfobyid/{userId}/{lavId}';
  public get_last_version_of_app_absolute_url = 'https://www.dynamicsoft.it/WscPrinterApp/version/app-latest-version.txt';
}