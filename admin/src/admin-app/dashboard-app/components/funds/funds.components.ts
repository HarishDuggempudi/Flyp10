 import{Component, OnInit}from'@angular/core';

@Component({
    selector: 'funds-transfer',
    templateUrl: './funds.components.html'
})
export class FundsTransferComponent implements OnInit {
    navLinks: any[] = [
        {label:'Judges Wallet', path: '/funds/judgeswallet'}, 
        {label:'Transfer Request', path: '/funds/request'},
        {label:'Transaction', path: '/funds/transaction'}
    ];

    constructor() {
        
    }

    ngOnInit() {
    }
}