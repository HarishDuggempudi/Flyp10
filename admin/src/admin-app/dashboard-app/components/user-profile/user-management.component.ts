
import{Component, OnInit}from'@angular/core';
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel, UserResponse} from "../user-management/user.model";

@Component({
    selector: 'user-management',
    templateUrl: './user-management.html'
})
export class UserProfileManagementComponent implements OnInit {
    navLinks: any[] = [
        {label:'Profile', path: '/profile'}, 
        {label: 'Password', path: '/profile/password'}
        ,{label: 'Sport', path: '/profile/sport'},  
        // {label: 'Setting', path: '/profile/setting'}
    ];
    loginobjUser:RegisterUserModel = new RegisterUserModel();
	userId:string;
    constructor() {
        let userInfo:RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.userId = userInfo._id;
        this.loginobjUser=userInfo;
    }

    ngOnInit() {
		 if(this.loginobjUser.userRole=='2'){
			 this.navLinks= [
								{label:'Profile', path: '/profile'}, 
								{label: 'Password', path: '/profile/password'},
								{label: 'Sport', path: '/profile/sport'},  
							    {label: 'Account Info', path: '/profile/accountinfo'}
							];
		 }else if(this.loginobjUser.userRole=='4'){
			this.navLinks= [
				{label:'Profile', path: '/profile'}, 
				{label: 'Password', path: '/profile/password'},
				
				
			];
		 }
		 else{
			 this.navLinks= [
								{label:'Profile', path: '/profile'}, 
								{label: 'Password', path: '/profile/password'},
								{label: 'Sport', path: '/profile/sport'},  
							//	{label: 'Saved Cards', path: '/profile/cards'},
							//	{label: 'USA Gymnastics Membership', path: '/profile/usa-gym-member'}
							    
							];
		 }
    }
}

