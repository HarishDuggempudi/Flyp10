 import{Component, OnInit}from'@angular/core';
 import {Config} from "../../../shared/configs/general.config";

import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'user-superadmin-view',
    templateUrl: './user-superadmin-view.html'
})
export class UserSuperAdminViewComponent implements OnInit {
    navLinks: any[] = [
        {label:'Basic Info', path: '/basic'}, 
        {label: 'Wallet Info', path: '/advance'}
       
    ];
	userId:string;
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
       activatedRoute.params.subscribe(param => {this.userId = param['userId']});
    }

  ngOnInit() {
    this.navLinks= [
        {label:'Basic Info', path: '/user-management/detail/'+this.userId+'/basic'}, 
        {label: 'Wallet Info', path: '/user-management/detail/'+this.userId+'/advance'}
       
    ];
    }
}

