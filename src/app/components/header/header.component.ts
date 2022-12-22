import {Component, OnInit} from '@angular/core';
import {UserNameStorageService} from "../../services/user-name-storage.service";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	constructor(public userName: UserNameStorageService) {}
}
