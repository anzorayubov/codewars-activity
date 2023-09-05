import {inject, Injectable} from '@angular/core';
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
	private http = inject(HttpClient)
	private userNameService = inject(UserNameStorageService)

	constructor() {
	}

	getKatas(): Observable<CodewarsResponse> {
		this.userName = this.userNameService.getUserName()
		return this.http.get<CodewarsResponse>(this.url + this.userName + '/code-challenges/completed')
	}

	getUserInfo(): Observable<UserInfo> {
		this.userName = this.userNameService.getUserName()
		return this.http.get<UserInfo>(this.userInfoUrl + this.userName)
	}

}
