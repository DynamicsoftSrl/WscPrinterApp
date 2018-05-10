import { ApiProvider } from './../api/api';
import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from './../mapping/mapping';
import { ShipmentDetailsModel } from '../../models/shipment-details-model';

@Injectable()
export class ShipmentProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider,
    private api: ApiProvider) {
  }

  async getShipmentDetails(id: string) {
    let domain = await this.localStorage.getDomain();

    let url = domain + this.mapping.get_shipment_details.replace('{id}', id);

    return this.api.getAuth(url)
  }

  async setShipmentDetails(shipmentDetails: ShipmentDetailsModel) {
    let domain = await this.localStorage.getDomain();

    let url = domain + this.mapping.set_shipment_details;

    return this.api.postAuth(url, shipmentDetails);
  }

}
