import { ApiProvider } from './../api/api';
import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from './../mapping/mapping';

@Injectable()
export class ShipmentProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider,
    private api: ApiProvider) {
  }

  async getShipmentDetails(id: string) {
    let domain = await this.localStorage.getDomain()

    let url = domain + this.mapping.get_shipment_details.replace('{id}', id);
    
    return this.api.getAuth(url)
  }

}
