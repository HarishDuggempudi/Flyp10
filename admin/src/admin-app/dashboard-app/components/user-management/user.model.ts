import {ImageModel, ImageProperties} from '../../../shared/models/image.model';

export class UserModel {
    constructor() {
        this.userRole = "";
        this.active = false;
        this.securityQuestion = "";
    }

    _id:string;
    firstName:string;
    middleName:string;
    lastName:string;
    email:string;
    password:string;
    passphrase:string;
    phoneNumber:string;
    mobileNumber:string;
    securityQuestion:string;
    securityAnswer:string;
    active:boolean;
    userRole:string;
    username:string;
    imageAltText:string;
    imageTitle:string;
    imageName:string;
    imageProperties:ImageProperties;
    addedBy:string;
    addedOn:string;
    blocked:boolean;
    twoFactorAuthEnabled:boolean = false;
    isUSCitizen:string;
    country:string;
}
export class RegisterUserModel {
    constructor() {
        this.userRole = "";
        this.active = false;
        this.securityQuestion = "";
        this.package="";
        this.deleted=false;
        this.userConfirmed=false;
        this.alwaysSharedRoutine = 'N';
    }
    alwaysSharedRoutine:string;
    _id:string;
    firstName:string;
    lastName:string;
    dob:string;
    email:string;
    password:string;
    passphrase:string;
    phoneNumber:string;
    dateofbirth:string;
    securityQuestion:string;
    securityAnswer:string;
    paylianceCID:number;
    active:boolean;
    userRole:string;
    package:string;
    username:string;
    imageAltText:string;
    imageTitle:string;
    imageName:string;
    imageProperties:ImageProperties;
    addedBy:string;
    EligibleJudgeForMyFlyp10Routine:boolean;
    addedOn:string;
    blocked:boolean;
    address:string;
    deleted:boolean
    deletedBy:string;
    deletedOn:string;
	cardToken:string;
	subtype:string;
	subStart:string;
	subEnd:string;
    promocode:string;
    userConfirmed: boolean;
    recruiterStatus: string;
    isUSCitizen:string;
    country:string;
    referrer:string;
    referralType:string;
}

export class JudgeSportModel {
    constructor() {
        this.active = true;
      this.uploadingfor = '0'
    }

    _id:string;
    active:boolean;
    username:string;
    sportName:string;
    level:string;
    docName:string;
    file:File;
    docdescription:string;
    originalfilename:string;
    addedBy:string;
    addedOn:string;
	status:string;
	expdate:string;
    deleted:boolean
    deletedBy:string;
    deletedOn:string;
    docProperties:{
        docPath:string
    }
    uploadingfor:string;
	sportid:string;
	levelid:string;
	userid:string;
}
export class UserResponse {
    dataList:UserModel[];
    currentPage:number = 1;
    totalItems:number = 0;
	totaldataItem:UserModel[];
}
export class JudgesResponse {
    dataList:JudgeSportModel[];
    currentPage:number = 1;
    totalItems:number = 0;
	totaldataItem:JudgeSportModel[];
}
export class RegisterUserResponse {
    dataList:RegisterUserModel[];
    currentPage:number = 1;
    totalItems:number = 0;
	totaldataItem:RegisterUserModel[];
}
export class UserSecurityModel {
    constructor() {
        this.securityQuestion = "";
    }

    _id:string;
    securityQuestion:string;
    securityAnswer:string;
}

export class UserSettingModel {
    _id:string;
    twoFactorAuthEnabled:boolean = false;
}
export class JudgeSport {
    constructor() {
        this.sportName = "";
        this.level = "";
      
    }
    _id:string;
    sportName:string;
    level:string;
    doc:File;
    deleted:boolean
    deletedBy:string;
	status:string;
	expdate:string;
    deletedOn:string;
    docProperties:{
    docPath:string
    };
    docdescription:string;
	sportid:string;
	levelid:string;
	userid:string;
}

export class AccountModel {
    constructor() {
       this.isprimary=false
      
    }
    _id:string;
    bankName:string;
    accountnumber:string;
    abanumber:string;
    accounttype:string;
	isprimary:boolean
    deleted:boolean
    deletedBy:string;
    deletedOn:string;
	addedBy:string;
    addedOn:string;
	ischecking:boolean;
   
}