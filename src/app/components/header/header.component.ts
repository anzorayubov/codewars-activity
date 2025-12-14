import {AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChild} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {CodewarsResponse, UserInfo} from "../../interfaces";
import {catchError, debounceTime, fromEvent, of, switchMap, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {

	@ViewChild('userNameInput') userNameInput!: ElementRef<HTMLInputElement>;

	public userInfo: UserInfo;
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
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((user: UserInfo) => {
				this.userInfo = user
			});

		// Обработка ввода username с debouncing
		const input = this.userNameInput.nativeElement;
		fromEvent<KeyboardEvent>(input, 'keyup')
			.pipe(
				debounceTime(500),
				tap(() => this.userNameService.saveUserName(input.value.trim())),
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
		// Зима: декабрь (11), январь (0), февраль (1)
		this.isWinter = currentMonth === 11 || currentMonth === 0 || currentMonth === 1;

		if (this.isWinter) {
			// Создаем массив для 50 снежинок (больше маленьких)
			this.snowflakes = Array.from({length: 50}, (_, i) => i);
		}
	}
}
