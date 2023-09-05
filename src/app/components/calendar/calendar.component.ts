import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {catchError, debounceTime, fromEvent, of, Subscription, switchMap, tap} from "rxjs";
import {Kata} from "../../interfaces";

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

	constructor(
		public dataService: DataService,
		private userName: UserNameStorageService) {
	}

	public beforeMonday = []
	public years: any = [];
	private subscriptions: Subscription

	ngOnInit() {
		const subscription1 = this.dataService.getKatas().subscribe((response: any) => {
			this.setData(response.data);
		});

		this.subscriptions.add(subscription1)

		const input: HTMLInputElement = document.querySelector('.userName')

		const subscription2 = fromEvent(input, 'keyup')
			.pipe(
				debounceTime(1000),
				tap(() => this.userName.saveUserName(input.value.trim())),
				switchMap(() => {
					return this.dataService.getKatas()
						.pipe(
							catchError(() => {
								this.years = []
								return of({data: []})
							})
						)
				})
			)
			.subscribe((response: any) => {
				this.setData(response.data);
			})

		this.subscriptions.add(subscription2)

	}

	private setData(response: Kata[]) {
		const katas = this.formattingArray(response);
		const completedKataByYear = new Map();

		for (const kata of katas) {
			const year = new Date(kata.completedAt).getFullYear();
			if (!completedKataByYear.has(year)) {
				completedKataByYear.set(year, []);
			}
			completedKataByYear.get(year).push(kata);
		}

		for (const [year, completedKata] of completedKataByYear) {
			const daysInYear = this.getDaysInYear(+year);
			this.years.push([{
				year: year,
				completedKata: completedKata,
				dayInYear: daysInYear.length,
				days: daysInYear,
			}]);
		}

		for (const year of this.years) {
			for (const day of year[0].days) {
				day.completedKata = completedKataByYear.get(year[0].year)
					.filter(kata => day.date === kata.completedAt);
			}
		}
	}

	private getDaysInYear(year: number) {
		const days = [];
		const start = new Date(year, 0, 1);
		const end = new Date(year + 1, 0, 1);
		let isFirstMonday = false;

		for (let date = start; date < end; date.setDate(date.getDate() + 1)) {

			if (start.toDateString().split(' ', 1)[0] === 'Mon') {
				isFirstMonday = true

			}

			if (isFirstMonday) {
				days.push({
					date: date.toDateString(),
					completedKata: [],
				});
			} else {
				this.beforeMonday.push({
					date: date.toDateString(),
					completedKata: [],
				});
			}

		}
		return days;
	}

	private formattingArray(array: any): Kata[] {
		return array.map((item: any) => {
			return {
				name: item.name,
				completedAt: new Date(item.completedAt).toDateString()
			}
		})
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe()
	}

}
