import{Component, OnInit}from'@angular/core';

@Component({
    selector: 'user-Verify',
    templateUrl: './verifyjudges.html'
})
export class UserProfieVerifyComponent implements OnInit {
    navLinks: any[] = [
        {label:'Verified', path: '/user-management/verifyjudges/verified'}, 
        {label: 'Unverified', path: '/user-management/verifyjudges/unverified'}
        ,{label: 'Expired', path: '/user-management/verifyjudges/expired'},  
	    {label: 'Rejected', path: '/user-management/verifyjudges/rejected'}
        // {label: 'Setting', path: '/profile/setting'}
    ];

    constructor() {
        
    }

    ngOnInit() {
    }
}

