import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserNameStorageService} from "./user-name-storage.service";
import {Observable} from "rxjs";
import {CodewarsResponse, UserInfo} from "../interfaces";

@Injectable({
	providedIn: 'root'
})

export class DataService {
	private readonly url = 'https://www.codewars.com/api/v1/users/'
	private readonly userInfoUrl = 'https://www.codewars.com/api/v1/users/'
	private userName = ''

	constructor(
		private http: HttpClient,
		private userNameService: UserNameStorageService) {
		this.userName = this.userNameService.getUserName()
	}

	getKatas(): Observable<CodewarsResponse> {
		return this.http.get<CodewarsResponse>(this.url + this.userName + '/code-challenges/completed')
	}

	getUserInfo(): Observable<UserInfo> {
		return this.http.get<UserInfo>(this.userInfoUrl + this.userName)
	}

}
