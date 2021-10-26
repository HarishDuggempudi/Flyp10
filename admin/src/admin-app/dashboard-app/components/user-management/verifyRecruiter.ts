 import{Component, OnInit}from'@angular/core';

@Component({
    selector: 'recruiter-Verify',
    templateUrl: './verifyRecruiter.html'
})
export class UserRecruiterVerifyComponent implements OnInit {
    navLinks: any[] = [
        {label:'Verified', path: '/user-management/verifyrecruiter/verified'}, 
        {label:'Unverified', path: '/user-management/verifyrecruiter/unverified'}, 
	    {label:'Rejected', path: '/user-management/verifyrecruiter/rejected'}
    ];

    constructor() {
        
    }

    ngOnInit() {
    }
}

