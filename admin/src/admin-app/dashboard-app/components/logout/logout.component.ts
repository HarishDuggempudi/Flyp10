
import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {LoginService} from '../../../login-app/components/login/login.service';
@Component({
  selector: 'team-detail',
  template: ''
})
export class LogoutComponent implements OnInit,AfterViewInit {




  constructor(private _router: Router, private loginService: LoginService) {
 

  }

  ngAfterViewInit() {
   
  }

  ngOnInit() {
    this.loginService.logout();
    this._router.navigate(['/login']);
  }

}

