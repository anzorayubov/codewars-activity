import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserNameStorageService {

  constructor() { }

  saveUserName(name: string): void {
    localStorage.setItem('userName', name)
  }

  getUserName(): string {
    return localStorage.getItem('userName')
  }

}
