import { ApiProvider } from './../api/api';
import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from './../mapping/mapping';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShipmentProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private localStorage: LocalStorageProvider,
    private api: ApiProvider) {
  }

  getShipmentDetails(id: string): Promise<Observable<any>> {
    let shipmentDetails = this.localStorage.getDomain()
      .then(domain => {
        let url = domain + this.mapping.get_shipment_details.replace('{id}', id);

        return this.api.getAuth(url)
      }).catch(err => {
        return err;
      });

    return shipmentDetails;
  }

}
