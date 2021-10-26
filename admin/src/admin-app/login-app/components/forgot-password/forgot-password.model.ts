export class ForgotPasswordModel {
    constructor() {
        this.securityQuestion = "";
    }

    email:string;
    username:string;
    securityQuestion:string;
    securityAnswer:string;

}