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
