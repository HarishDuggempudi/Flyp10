import {ImageProperties} from "../../../shared/models/image.model";
export class TeamMateModel {
    _id:string;
    UID:string;
    FID:string;
    status:string;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
}

export class TeamMateResponse {
    dataList:TeamMateModel[];
    totalItems:number;
    currentPage:number;
}
