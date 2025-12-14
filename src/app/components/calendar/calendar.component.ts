import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {CodewarsResponse, Kata, YearData} from "../../interfaces";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	public years: YearData[][] = [];
	private dataService = inject(DataService);
	private destroyRef = inject(DestroyRef);

	ngOnInit(): void {
		// Подписка на изменения данных от DataService
		this.dataService.getKatas()
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((response: CodewarsResponse) => {
				this.setData(response.data);
			});
	}

	private setData(response: Kata[]): void {
		// Очищаем массив перед заполнением, чтобы избежать дублирования
		this.years = [];

		const katas = this.formattingArray(response);
		const completedKataByYear = new Map<number, Kata[]>();

		for (const kata of katas) {
			const year = new Date(kata.completedAt).getFullYear();
			if (!completedKataByYear.has(year)) {
				completedKataByYear.set(year, []);
			}
			completedKataByYear.get(year)!.push(kata);
		}

		for (const [year, completedKata] of completedKataByYear) {
			const daysInYear = this.getDaysInYear(year);
			this.years.push([{
				year: year,
				completedKata: completedKata,
				dayInYear: daysInYear.length,
				days: daysInYear,
			}]);
		}

		for (const year of this.years) {
			for (const day of year[0].days) {
				day.completedKata = completedKataByYear.get(year[0].year)!
					.filter((kata: Kata) => day.date === kata.completedAt);
			}
		}
	}

	private getDaysInYear(year: number) {
		const days = [];
		const start = new Date(year, 0, 1);
		const end = new Date(year + 1, 0, 1);

		// Calculate offset for Monday alignment
		const firstDayOfWeek = start.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
		const offset = (firstDayOfWeek + 6) % 7; // Convert to Monday-based offset

		// Add placeholder days before January 1st for Monday alignment
		for (let i = 0; i < offset; i++) {
			days.push({
				isPlaceholder: true,
				date: null,
				completedKata: [],
			});
		}

		// Add all real days from January 1st to December 31st
		for (let date = new Date(start); date < end; date.setDate(date.getDate() + 1)) {
			days.push({
				isPlaceholder: false,
				date: this.normalizeToLocalDate(date),
				completedKata: [],
			});
		}

		return days;
	}

	private formattingArray(array: any): Kata[] {
		return array.map((item: any) => {
			return {
				name: item.name,
				completedAt: this.normalizeToLocalDate(item.completedAt)
			}
		})
	}


	/**
	 * Normalizes a date to YYYY-MM-DD format in local timezone.
	 * This ensures consistent date comparison regardless of the input format.
	 *
	 * @param date - Date object, date string, or timestamp
	 * @returns Normalized date string in YYYY-MM-DD format (e.g., "2023-01-01")
	 */
	private normalizeToLocalDate(date: Date | string): string {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

}
