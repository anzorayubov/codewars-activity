import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {UserInfo} from "../../interfaces";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

	userInfo: UserInfo
	subscription: Subscription

	constructor(public userName: UserNameStorageService, public dataService: DataService) {
	}

	ngOnInit(): void {
		this.subscription = this.dataService.getUserInfo().subscribe((user: UserInfo) => {
			this.userInfo = user
		})
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe()
	}

}
