export interface CodewarsResponse {
	data: Kata[]
	totalItems: number
	totalPages: number
}

export interface Kata {
	completedAt: Date | string  // Date от API, string после форматирования
	name: string
	completedLanguages?: []
	id?: number
	slug?: string
	days?: []
}

export interface UserInfo {
	clan: null
	codeChallenges: { totalAuthored: number, totalCompleted: number }
	honor: number
	id: string
	leaderboardPosition: number
	name: string
	ranks: {
		"overall": {
			"rank": number,
			"name": string,
			"color": string,
			"score": number
		},
		"languages": {
			"javascript": {
				"rank": number,
				"name": string,
				"color": string,
				"score": number
			}
		}
	}
	skills: null
	username: string
}

export interface CalendarDay {
	isPlaceholder: boolean
	date: string | null  // Format: YYYY-MM-DD in local timezone
	completedKata: Kata[]
}

export interface YearData {
	year: number
	completedKata: Kata[]
	dayInYear: number
	days: CalendarDay[]
}
