import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private url = 'https://www.codewars.com/api/v1/users/anzorayubov/code-challenges/completed'

  constructor(private http: HttpClient) {}

  getKatas(): any {
    return this.http.get(this.url)
  }

}
