import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {debounceTime, fromEvent} from "rxjs";
import {CodewarsResponse, daysCount, Kata} from "../../interfaces";

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	constructor(
		public dataService: DataService,
		private userName: UserNameStorageService) {}

	public years: any = [];

	ngOnInit() {

		this.getData()
		const input = document.querySelector('.userName')

		fromEvent(input, 'keyup')
			.pipe(
				debounceTime(1000)
			)
			.subscribe((event: any) => {
				this.userName.setUserNameToStorage(event.target.value.trim())
				this.getData()
				this.years = []
			})
	}

	getData(): void {
		this.dataService.getKatas().subscribe((response: CodewarsResponse) => {
			const katas = this.formattingArray(response.data);
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
		});
	}

	getDaysInYear(year): string[] {
		const date = new Date(year, 0, 1);
		const end = new Date(date);
		const array = []
		end.setFullYear(end.getFullYear() + 1);

		while (date < end) {
			array.push(
				{
					date: date.toDateString(),
					completedKata: []
				}
			)
			date.setDate(date.getDate() + 1)
		}

		return array
	}

	formattingArray(array: any): Kata[] {
		return array.map((item: any) => {
			return {
				name: item.name,
				completedAt: new Date(item.completedAt).toDateString()
			}
		})
	}

	daysInYear(year: number): daysCount {
		return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
	}

}
