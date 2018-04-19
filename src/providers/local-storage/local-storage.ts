import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageProvider {

  constructor(public http: HttpClient) {
  }

  //localStorage variables(keys)
  readonly tokenNameInLocalStorage: string = 'token';
  readonly domainNameInLocalStorage: string = 'domain';
  // **************************************************

  saveToLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  removeItemFromLocalStorage(name: string): void {
    localStorage.removeItem(name);
  }

  getItemFromLocalStorage(name: string): string {
    return localStorage.getItem(name);
  }
}
