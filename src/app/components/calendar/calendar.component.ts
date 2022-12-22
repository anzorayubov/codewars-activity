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

			let katas = this.formattingArray(response.data)
			let years = {}

			katas.forEach((item: Kata) => {
				const year = new Date(item.completedAt).getFullYear()
				years[year] = {completedKata: []}
			})

			katas.forEach((item: Kata) => {
				const year = new Date(item.completedAt).getFullYear()
				years[year].completedKata.push(item)
			})

			for (let year in years) {
				this.years.unshift(
					[{
						year: year,
						completedKata: years[year].completedKata,
						dayInYear: this.daysInYear(+year),
						days: []
					}]
				)
			}

			this.years.forEach(year => {
				year[0].days = this.getDaysInYear(year[0].year)
			})

			this.years.forEach(year => {
				year[0].days.forEach(day => {
					year[0].completedKata.forEach((kata: Kata) => {
						if (day.date === kata.completedAt) {
							day.completedKata.push(kata)
						}
					})
				})
			})
		})
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
