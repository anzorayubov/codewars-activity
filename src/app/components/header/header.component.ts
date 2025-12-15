import {AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {CodewarsResponse, UserInfo} from "../../interfaces";
import {catchError, debounceTime, filter, fromEvent, map, of, switchMap, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements AfterViewInit {

	private readonly DEBOUNCE_TIME_MS = 500;
	private readonly SNOWFLAKE_COUNT = 50;

	@ViewChild('userNameInput') userNameInput!: ElementRef<HTMLInputElement>;

	public userInfo?: UserInfo;
	private dataService = inject(DataService);
	private userNameService = inject(UserNameStorageService);
	public userName = this.userNameService.getUserName();
	private destroyRef = inject(DestroyRef);
	public isWinter: boolean = false;
	public snowflakes: number[] = [];

	constructor() {
		this.checkWinter();
	}

	ngAfterViewInit(): void {
		this.dataService.getUserInfo()
			.pipe(
				catchError(() => of<UserInfo | null>(null)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((user: UserInfo | null) => {
				if (user) {
					this.userInfo = user
				}
			});

		// Handle username input with debouncing
		const input = this.userNameInput.nativeElement;
		fromEvent<KeyboardEvent>(input, 'keyup')
			.pipe(
				map(() => input.value.trim()),
				debounceTime(this.DEBOUNCE_TIME_MS),
				filter(username => username.length > 0), // Only proceed if username is not empty
				tap(username => this.userNameService.saveUserName(username)),
				takeUntilDestroyed(this.destroyRef),
				switchMap(() => {
					return this.dataService.getKatas()
						.pipe(
							catchError(() => of<CodewarsResponse>({data: [], totalItems: 0, totalPages: 0}))
						)
				})
			)
			.subscribe();
	}

	private checkWinter(): void {
		const currentMonth = new Date().getMonth(); // 0-11
		// Winter: December (11), January (0), February (1)
		this.isWinter = currentMonth === 11 || currentMonth === 0 || currentMonth === 1;

		if (this.isWinter) {
			// Create array for snowflakes
			this.snowflakes = Array.from({length: this.SNOWFLAKE_COUNT}, (_, i) => i);
		}
	}
}
