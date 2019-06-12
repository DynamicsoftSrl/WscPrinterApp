import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    // append these headers because of disabling cache
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-control', 'no-cache');
    headers.append('Cache-control', 'no-store');
    headers.append('Expires', '0');
    headers.append('Pragma', 'no-cache');

    const httpOptions = {
      headers: headers
    };

    //adding datetime now to url because of disabling caching of file
    const dateNow = Date.now();
    url += `?${dateNow}`;
    return this.http.get(url, httpOptions);
  }

  // check if user's phone has internet connection
  isConnected(): boolean {
    let conntype = this.network.type;

    return conntype && conntype !== 'unknown' && conntype !== 'none';
  }
}
