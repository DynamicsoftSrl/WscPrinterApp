import { ApiProvider } from '../api/api.provider';
import { LocalStorageProvider } from '../local-storage/local-storage.provider';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from '../mapping/mapping.provider';
import { ShipmentDetailsModel } from '../../models/shipment-details-model';

@Injectable()
export class ShipmentProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider,
    private api: ApiProvider) {
  }

  async getShipmentDetails(id: string) {
    const domain = await this.localStorage.getDomain();

    const url = domain + this.mapping.get_shipment_details.replace('{id}', id);

    return this.api.getAuth(url);
  }

  async setShipmentDetails(shipmentDetails: ShipmentDetailsModel) {
    const domain = await this.localStorage.getDomain();

    const url = domain + this.mapping.set_shipment_details;

    return this.api.postAuth(url, shipmentDetails);
  }

}
