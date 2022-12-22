export interface CodewarsResponse {
	data: Kata[]
	totalItems: number
	totalPages: number
}

export interface Kata {
	completedAt: Date
	name: string
	completedLanguages?: []
	id?: number
	slug?: string
	days?: []
}

export type daysCount = 365 | 366
