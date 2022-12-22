import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserNameStorageService} from "./user-name-storage.service";

@Injectable({
	providedIn: 'root'
})

export class DataService {
	private url = 'https://www.codewars.com/api/v1/users/'
	private userName = ''

	constructor(
		private http: HttpClient,
		private userNameService: UserNameStorageService) {
	}

	getKatas(): any {
		this.userName = this.userNameService.getUserName()
		return this.http.get(this.url + this.userName + '/code-challenges/completed')
	}

}
