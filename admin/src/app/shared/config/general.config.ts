//import 'cloudinary';
//declare var cloudinary:any;
import {HOST_URL} from './env.config';

export const AUTH_TOKEN_KEY = "NodeBeatAuthToken";
export const ADMIN_ROUTE = "AdminRoute";
export const USERINFO = "UserInfo";
export const EXPIRES_ON = "DateTime";

// let cloudinary = require('cloudinary');

export class Config {
    static AuthToken ="";
    static AdminRoute = "";
    static UserInfo = "";
    static EXPIRES_ON = "";
    static adminurl="https://flyp10.com/admin";
    static captchaSiteKey ="6LdfKsMZAAAAAHFd6VxiGKFv89oZ4uSQxCAXd2ZQ"
    static captchaSecretKey ="6LdfKsMZAAAAAA2Zfde03lVt1OJ87LWwTudQuja8"
    // static AuthToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    // static AdminRoute = window.localStorage.getItem(ADMIN_ROUTE);
    // static UserInfo = window.localStorage.getItem(USERINFO);
    // static EXPIRES_ON = window.localStorage.getItem(EXPIRES_ON);
    /*
     cloudinary is declared in manual typings and script in included in head tag
     */
    // static Cloudinary: any = cloudinary; //change parameters for default cloudinary setting
    static Cloudinary = typeof window !="undefined"? cloudinary.Cloudinary.new({cloud_name: "nodebeat-v3-test"}) : '';
    static DefaultAvatar = HOST_URL + "/assets/admin/img/defaults/default_avatar.png";
    static DefaultImage = HOST_URL + "/assets/admin/img/defaults/default_img.png";
    static DefaultWideImage = HOST_URL + "/assets/admin/img/defaults/default_wide_img.png";
    static InvalidImage = HOST_URL + "/assets/admin/img/defaults/invalid_image.png";
    static LoginImage = HOST_URL + '/assets/admin/img/SB-admin.png';
    static GoogleAuthImage = HOST_URL + '/assets/admin/img/google_auth_silver.png';
}
