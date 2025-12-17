import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SnowEffectService {

	private readonly SNOWFLAKE_COUNT = 50;

	public isWinter(): boolean {
		const currentMonth = new Date().getMonth(); // 0-11
		// Winter: December (11), January (0), February (1)
		return currentMonth === 11 || currentMonth === 0 || currentMonth === 1;
	}

	public getSnowflakes(): number[] {
		return this.isWinter()
			? Array.from({length: this.SNOWFLAKE_COUNT}, (_, i) => i)
			: [];
	}
}
