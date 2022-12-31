import {Component} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";
import {UserInfo} from "../../interfaces";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userInfo: UserInfo

	constructor(public userName: UserNameStorageService, public dataService: DataService) {

		dataService.getUserInfo().subscribe((user: UserInfo) => {
			this.userInfo = user
		})
	}
}
