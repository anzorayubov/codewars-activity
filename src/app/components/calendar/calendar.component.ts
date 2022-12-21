import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	constructor(public dataService: DataService) {
	}

	public katas: any[] = [];
	public years: any = [];

	ngOnInit() {

		this.dataService.getKatas().subscribe((response: any) => {
			this.katas = this.formattingArray(response.data)

			let years = {}

			this.katas.forEach((item: any) => {
				const year = new Date(item.completedAt).getFullYear()
				years[year] = {completedKata: []}
			})

			this.katas.forEach((item: any) => {
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
				console.log(year[0])
			})


			this.years.forEach(year => {

				console.log(
					year[0].days,
					year[0].completedKata
				)

				year[0].days.forEach(day => {
					year[0].completedKata.forEach(kata => {
						if (day.date === kata.completedAt) {
							day.completedKata.push(kata)
						}
					})
				})
			})
		})

	}

	getDaysInYear(year) {
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

	formattingArray(array: any) {
		return array.map((item: any) => {
			return {
				name: item.name,
				completedAt: new Date(item.completedAt).toDateString()
			}
		})
	}

	daysInYear(year: number): number {
		return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
	}


}
