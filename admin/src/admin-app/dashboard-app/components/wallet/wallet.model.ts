export class WalletModel {
    constructor() {
        this.balance='0';
        
    }
	_id:string;
    balance:string;
    userid:string;
	deleted:boolean;
	addedOn:string;
}
export class VideoResponse {
    dataList:WalletModel[];
    totalItems:number;
    currentPage:number;
}

export class DefaultCard {
   cardNumber:string;
   cardType:string;
   token:string;
}