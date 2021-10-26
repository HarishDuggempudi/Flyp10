
import{Component, OnInit}from'@angular/core';
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";

@Component({
    selector: 'judges-history-table',
    templateUrl: './judges-history-table.html'
})
export class JudgesHistoryTableComponent implements OnInit {
    navLinks: any[] = [
        {label:'Transaction History', path: '/wallet/'}, 
        {label: 'Remittance History', path: '/wallet/remittance'} 
    ];
    loginobjUser:RegisterUserModel = new RegisterUserModel();
	userId:string;
    constructor() {
        let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
    }

    ngOnInit() {
    }
}

