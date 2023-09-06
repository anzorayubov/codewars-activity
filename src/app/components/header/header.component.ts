import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {UserInfo} from "../../interfaces";
import {Subscription} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	public userInfo: UserInfo
	private dataService = inject(DataService)
	public userName = inject(UserNameStorageService).getUserName()
	private destroyRef = inject(DestroyRef);

	constructor() {
	}

	ngOnInit(): void {
		this.dataService.getUserInfo()
			.pipe(
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((user: UserInfo) => {
				this.userInfo = user
			})
	}
}
