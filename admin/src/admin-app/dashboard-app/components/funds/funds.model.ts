export class FundsModel {
    constructor() {
        this.balance='0';
        
    }
	_id:string;
    balance:string;
    userid:string;
	deleted:boolean;
	addedOn:string;
}
export class FundsResponse {
    dataList:FundsModel[];
    totalItems:number;
    currentPage:number;
}