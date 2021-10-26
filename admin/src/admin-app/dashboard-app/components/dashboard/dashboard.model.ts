import {GoogleAnalyticsModel} from '../google-analytics/google-analytics.model';

export class DashboardResponseModel {
    analyticsData:GoogleAnalyticsModel;
    token:any;
}

export class DashboardModel {
    constructor(){
        
    }
    totalRountine:string='0';
    availableCredit:string='0';
    usedcredits:string='0';
    newComment:string="0";
    completedRoutine:string='0';
    pendingRoutine:string='0';
    pendingRequested:string='0';
    connecteduser:string='0';

}
