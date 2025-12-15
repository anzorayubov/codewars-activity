import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UserNameStorageService} from "./user-name-storage.service";
import {Observable} from "rxjs";
import {CodewarsResponse, UserInfo} from "../interfaces";

@Injectable({
	providedIn: 'root'
})

export class DataService {
	private readonly baseUrl = 'https://www.codewars.com/api/v1/users/'
	private http = inject(HttpClient)
	private userNameService = inject(UserNameStorageService)

	private get userName(): string {
		return this.userNameService.getUserName()
	}

	getKatas(): Observable<CodewarsResponse> {
		return this.http.get<CodewarsResponse>(`${this.baseUrl}${this.userName}/code-challenges/completed`)
	}

	getUserInfo(): Observable<UserInfo> {
		return this.http.get<UserInfo>(`${this.baseUrl}${this.userName}`)
	}

}
