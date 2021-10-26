import { Component } from "../../../../../node_modules/@angular/core";

@Component({
    selector: 'analytics',
    templateUrl: 'analytics.html',
    styles: ['./analytics.scss']
  })

export class Analytics  {

    selectedTab:any=0;


    selectTab(event) {
        this.selectedTab = event;
        }

}