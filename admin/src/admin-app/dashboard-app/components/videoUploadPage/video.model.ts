export class VideoModel {
    constructor() {
        this.active=true;
      
    }
	_id:string;
    title:string;
    subtitle:string;
    filename:string;
    filetype:string;
    filepath:string;
    active:boolean;
	type:string;
	deleted:boolean;
	addedOn:string;
}
export class VideoResponse {
    dataList:VideoModel[];
    totalItems:number;
    currentPage:number;
}