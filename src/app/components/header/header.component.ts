import {Component} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";
import {DataService} from "../../services/data.service";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
	userInfo

	constructor(public userName: UserNameStorageService, public dataService: DataService) {

		dataService.getUserInfo().subscribe(user => {
			this.userInfo = user
		})
	}
}
