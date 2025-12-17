import {AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {ThemeService} from "../../services/theme.service";
import {SnowEffectService} from "../../services/snow-effect.service";
import {UserInfo} from "../../interfaces";
import {debounceTime, filter, fromEvent, map, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements AfterViewInit {

	private readonly DEBOUNCE_TIME_MS = 500;

	@ViewChild('userNameInput') userNameInput!: ElementRef<HTMLInputElement>;

	public userInfo?: UserInfo;
	private dataService = inject(DataService);
	private userNameService = inject(UserNameStorageService);
	private themeService = inject(ThemeService);
	private snowEffectService = inject(SnowEffectService);
	public userName = this.userNameService.getUserName();
	private destroyRef = inject(DestroyRef);
	public isWinter = this.snowEffectService.isWinter();
	public snowflakes = this.snowEffectService.getSnowflakes();
	public currentTheme$ = this.themeService.theme$;

	ngAfterViewInit(): void {
		// Subscribe to shared user info
		this.dataService.userInfo$
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((user: UserInfo | null) => {
				if (user) {
					this.userInfo = user
				}
			});

		// Fetch initial data if username exists
		if (this.userName) {
			this.dataService.fetchKatas();
			this.dataService.fetchUserInfo();
		}

		// Handle username input with debouncing
		const input = this.userNameInput.nativeElement;
		fromEvent<KeyboardEvent>(input, 'keyup')
			.pipe(
				map(() => input.value.trim()),
				debounceTime(this.DEBOUNCE_TIME_MS),
				filter(username => username.length > 0), // Only proceed if username is not empty
				tap(username => this.userNameService.saveUserName(username)),
				tap(() => {
					// Fetch data for new username
					this.dataService.fetchKatas();
					this.dataService.fetchUserInfo();
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	public toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
