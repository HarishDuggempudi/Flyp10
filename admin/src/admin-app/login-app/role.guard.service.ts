import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { LoginService } from "./components/login/login.service";
import { Config } from "../shared/configs/general.config";
import { UserModel } from "../dashboard-app/components/user-management/user.model";
// import decode from 'jwt-decode';
@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public router: Router,private _loginService: LoginService) {}
  canActivate(route: ActivatedRouteSnapshot,): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    //console.log(route)
    const userInfo:UserModel = JSON.parse(Config.getUserInfoToken());
    // decode the token to get its payload
    if ( !(Config.getAuthToken() && Config.getAuthTokenValid()) || userInfo.userRole !== expectedRole ) {
      this._loginService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}