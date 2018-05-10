import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {

  constructor(private http: HttpClient,
    private localStorage: LocalStorageProvider) {

    //getting token from local storage
    localStorage.getItemFromLocalStorage(this.tokenName).then(token => {
      this.token = token;
    }).catch(err => { console.log(err) })

  }

  private tokenName = this.localStorage.tokenNameInLocalStorage;
  private token: string;

  //get request with authorization token inside headers
  getAuth(url: string, data?: any) {

    let httpOptions = this.appendHttpOptions();

    return this.http.get(url, httpOptions);
  }


  private appendHttpOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token.trim()
      })
    };

    return httpOptions;
  }
}
