import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UserNameStorageService} from "./user-name-storage.service";
import {BehaviorSubject, Observable} from "rxjs";
import {CodewarsResponse, UserInfo} from "../interfaces";

@Injectable({
	providedIn: 'root'
})

export class DataService {
	private readonly baseUrl = 'https://www.codewars.com/api/v1/users/'
	private http = inject(HttpClient)
	private userNameService = inject(UserNameStorageService)

	// BehaviorSubject to share kata data across components
	private katasSubject = new BehaviorSubject<CodewarsResponse>({data: [], totalItems: 0, totalPages: 0});
	public katas$ = this.katasSubject.asObservable();

	// BehaviorSubject to share user info across components
	private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
	public userInfo$ = this.userInfoSubject.asObservable();

	private get userName(): string {
		return this.userNameService.getUserName()
	}

	/**
	 * Fetches katas from API and broadcasts to all subscribers
	 */
	fetchKatas(): void {
		if (!this.userName) {
			this.katasSubject.next({data: [], totalItems: 0, totalPages: 0});
			return;
		}

		this.http.get<CodewarsResponse>(`${this.baseUrl}${this.userName}/code-challenges/completed`)
			.subscribe({
				next: (response) => this.katasSubject.next(response),
				error: () => this.katasSubject.next({data: [], totalItems: 0, totalPages: 0})
			});
	}

	/**
	 * Fetches user info from API and broadcasts to all subscribers
	 */
	fetchUserInfo(): void {
		if (!this.userName) {
			this.userInfoSubject.next(null);
			return;
		}

		this.http.get<UserInfo>(`${this.baseUrl}${this.userName}`)
			.subscribe({
				next: (response) => this.userInfoSubject.next(response),
				error: () => this.userInfoSubject.next(null)
			});
	}

	// Legacy methods - kept for backward compatibility but deprecated
	getKatas(): Observable<CodewarsResponse> {
		return this.http.get<CodewarsResponse>(`${this.baseUrl}${this.userName}/code-challenges/completed`)
	}

	getUserInfo(): Observable<UserInfo> {
		return this.http.get<UserInfo>(`${this.baseUrl}${this.userName}`)
	}

}
