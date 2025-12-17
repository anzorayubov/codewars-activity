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

	// Loading states
	private katasLoadingSubject = new BehaviorSubject<boolean>(false);
	public katasLoading$ = this.katasLoadingSubject.asObservable();

	private userInfoLoadingSubject = new BehaviorSubject<boolean>(false);
	public userInfoLoading$ = this.userInfoLoadingSubject.asObservable();

	// Error states
	private katasErrorSubject = new BehaviorSubject<string | null>(null);
	public katasError$ = this.katasErrorSubject.asObservable();

	private userInfoErrorSubject = new BehaviorSubject<string | null>(null);
	public userInfoError$ = this.userInfoErrorSubject.asObservable();

	private get userName(): string {
		return this.userNameService.getUserName()
	}

	/**
	 * Fetches katas from API and broadcasts to all subscribers
	 */
	fetchKatas(): void {
		if (!this.userName) {
			this.katasSubject.next({data: [], totalItems: 0, totalPages: 0});
			this.katasErrorSubject.next(null);
			return;
		}

		this.katasLoadingSubject.next(true);
		this.katasErrorSubject.next(null);

		this.http.get<CodewarsResponse>(`${this.baseUrl}${this.userName}/code-challenges/completed`)
			.subscribe({
				next: (response) => {
					this.katasSubject.next(response);
					this.katasLoadingSubject.next(false);
					this.katasErrorSubject.next(null);
				},
				error: (error) => {
					console.error('Failed to fetch katas:', error);
					this.katasSubject.next({data: [], totalItems: 0, totalPages: 0});
					this.katasLoadingSubject.next(false);
					this.katasErrorSubject.next('Failed to load activity data. Please check the username and try again.');
				}
			});
	}

	/**
	 * Fetches user info from API and broadcasts to all subscribers
	 */
	fetchUserInfo(): void {
		if (!this.userName) {
			this.userInfoSubject.next(null);
			this.userInfoErrorSubject.next(null);
			return;
		}

		this.userInfoLoadingSubject.next(true);
		this.userInfoErrorSubject.next(null);

		this.http.get<UserInfo>(`${this.baseUrl}${this.userName}`)
			.subscribe({
				next: (response) => {
					this.userInfoSubject.next(response);
					this.userInfoLoadingSubject.next(false);
					this.userInfoErrorSubject.next(null);
				},
				error: (error) => {
					console.error('Failed to fetch user info:', error);
					this.userInfoSubject.next(null);
					this.userInfoLoadingSubject.next(false);
					this.userInfoErrorSubject.next('Failed to load user info.');
				}
			});
	}


}
