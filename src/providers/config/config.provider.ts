import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MappingProvider } from '../mapping/mapping.provider';
import { Network } from '@ionic-native/network';

@Injectable()
export class ConfigProvider {

  constructor(public http: HttpClient,
    private mapping: MappingProvider,
    private network: Network) {
  }

  getIonicAppVersion() {
    let url = this.mapping.get_last_version_of_app_absolute_url;

    return this.http.get(url);
  }

  // check if user's phone has internet connection
  isConnected(): boolean {
    let conntype = this.network.type;

    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }
}
