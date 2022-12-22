import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserNameStorageService {

  constructor() { }

  setUserNameToStorage(name) {
    localStorage.setItem('userName', name)
  }

  getUserName() {
    return localStorage.getItem('userName')
  }

}
