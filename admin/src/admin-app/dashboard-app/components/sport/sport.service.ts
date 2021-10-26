import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {PricingModel,SportsPricingResponse,SportModel, SportResponse, EventModel, CategoryModel,CategoryResponse, SportsEventResponse, LevelModel,LevelResponse,ElementGroupModel,SportsElementgroupResponse,ElementModel,SportsElementResponse, MappingModel, MappingResponse} from "./sport.model";
import {Config} from "../../../shared/configs/general.config";
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class SportService {
    apiRoute:string = "sport";
    progressObserver:any;
    progress:any;
    eventapiroute:string="event";
    elementgroupApiRoute:string='elementgroup';
	eventByeventapiroute="eventsbyEvent";
    elementApiRoute:string='element'
    categoryApiRoute:string = "category";
    levelApiRoute:string = "level";
	pricingApi="sportpricing";
	pricinguserApi="usersportpricing";
    mappingApiRoute:string= "mapping";
	sportBymappingapiroute="sportinfobymapping";
    constructor(private xhrService: XhrService, private _http:HttpClient, private fileService:FileOperrationService) {
        // this.progress = Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

    handleError(error: HttpErrorResponse) {
       
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error.message}`);
          }
          // return an ErrorObservable with a user-facing error message
          return new ErrorObservable(error.error.message ? error.error.message :
            'Something bad happened; please try again later.');
    }

    handlemappingError(error: HttpErrorResponse) {
     
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error.message}`);
          }
          // return an ErrorObservable with a user-facing error message
          return new ErrorObservable(error.status ? error.status :
            'Something bad happened; please try again later.');
    }

    deleteImage(fileName:string, orgExt:string, path:string):Observable < any > {
        return this.fileService.deleteFile(fileName, orgExt, path,"image");
    }

    // Mapping services ============================

    mapSportWithElements(MappingObj){
        let body=JSON.stringify(MappingObj);
       

        // this._http.post(API_URL + this.mappingApiRoute, body).subscribe((res) => {
        //     console.log('response', res);
        // })

        return this._http.post(API_URL + this.mappingApiRoute, body);
        
    }

    updateMappedData(MappingObj:MappingModel) {
        let body = JSON.stringify(MappingObj);
      

        return this._http.put(API_URL + this.mappingApiRoute + "/" + MappingObj._id, body);
    }

    getMappedSportsData(perPage:number, currentPage:number, active?:boolean):Observable < MappingResponse> {
        // Initialize Params Object
        let query = new HttpParams();
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.mappingApiRoute, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }

    getMappedSportsDataById(objId:string):Observable < MappingModel> {
        return this._http.get<MappingModel>(API_URL + this.mappingApiRoute + "/" + objId)
            .pipe(
                catchError(this.handlemappingError)
            );
    }
    //pricing service start here ======================================
	
   getPricingList(perPage:number, currentPage:number, active?:boolean):Observable < SportsPricingResponse> {
        // Initialize Params Object
        let query = new HttpParams();
       
        // Begin assigning parameters
          query = query.append('perpage', perPage.toString());
          query = query.append('page', currentPage.toString());
        return this._http.get(API_URL + this.pricingApi, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
	
	getuserSportPrice(){
		 return this._http.get(API_URL + this.pricinguserApi )
            .pipe(
                catchError(this.handleError)
            );
	}
	
	
	savescoreCardSettings(scoreCardObj){
        let body=JSON.stringify(scoreCardObj);
        return this._http.post(API_URL + '/scoreCard', body)
        .pipe(
            catchError(this.handleError)
        );
    }
	getScoreCardConfigBySportid(id){
		 return this._http.get(API_URL + '/scoreCard/'+id )
            .pipe(
                catchError(this.handleError)
            );
	}
	getScoreCardConfig(perPage,currentPage){
		
		let query = new HttpParams();
       
        // Begin assigning parameters
          query = query.append('perpage', perPage.toString());
          query = query.append('page', currentPage.toString());
		 return this._http.get(API_URL + '/scoreCard',{params: query})
            .pipe(
                catchError(this.handleError)
            );
	}
	 savePricingConfiguration(pricingObj:PricingModel){
        let body=JSON.stringify(pricingObj);
        return this._http.post(API_URL + this.pricingApi, body)
        .pipe(
            catchError(this.handleError)
        );
    }
	 updatescoreCardSettings(scoreCardObj,id){
        let body=JSON.stringify(scoreCardObj);
        return this._http.patch(API_URL +'/scoreCard/'+id , body)
        .pipe(
            catchError(this.handleError)
        );
    }
	deletePricing(objDel:PricingModel):Observable<any> {
        let body = JSON.stringify(objDel);
        return this._http.patch(API_URL + this.pricingApi + "/" + objDel._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
	 updateSportPricing(obj:PricingModel) {
        let body = JSON.stringify(obj);
        return this._http.put(API_URL + this.pricingApi + "/" + obj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
	getSportPricingDetail(objId:string):Observable < PricingModel> {
        return this._http.get<PricingModel>(API_URL + this.pricingApi + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
	getSportPricingDetailbysportID(objId:string,scoretype) {
        return this._http.get<PricingModel>(API_URL + "getpricing" + "/" + objId + "/" + scoretype)
            .pipe(
                catchError(this.handleError)
            );
    }
	getState() {
        return this._http.get(API_URL + "getStates")
            .pipe(
                catchError(this.handleError)
            );
    }  
    getStateForCountry(country){
        return this._http.get(API_URL + "getStateForCountry/"+country)
        .pipe(
            catchError(this.handleError)
        );
    }
    getCity(sid) {
        return this._http.get(API_URL + "getCitybyStateID/"+sid)
            .pipe(
                catchError(this.handleError)
            );
    }	
	getZip(sid,cid) {
        return this._http.get(API_URL + "getZipCodebyStateID/"+sid+"/"+cid)
            .pipe(
                catchError(this.handleError)
            );
    }	
    // Event services =========================

    saveSportsEvent(EventObject:EventModel){
        let body=JSON.stringify(EventObject);
        return this._http.post(API_URL + this.eventapiroute, body)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateSportEvent(eventobj:EventModel) {
        let body = JSON.stringify(eventobj);
        return this._http.put(API_URL + this.eventapiroute + "/" + eventobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteSportsEvent(objDel:EventModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.eventapiroute + "/" + objDel._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
	
	getSportsEvent(perPage:number, currentPage:number, active?:boolean):Observable < SportsEventResponse> {
        // Initialize Params Object
        let query = new HttpParams();
     
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.eventapiroute, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }	
	getAllSportsEvent():Observable <any> {
        // Initialize Params Object
      
        return this._http.get(API_URL +'getAllevents')
            .pipe(
                catchError(this.handleError)
            );
    }
	getElementByevent(eventid):Observable <any> {
        // Initialize Params Object
      
        return this._http.get(API_URL +'getElementByevent/'+eventid)
            .pipe(
                catchError(this.handleError)
            );
    }
    getSporteventDetail(objId:string):Observable < EventModel> {
        return this._http.get<EventModel>(API_URL + this.eventapiroute + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
	getSporteventDetailbyEvent(objId:string){
        return this._http.get<EventModel>(API_URL + this.eventByeventapiroute + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
	getSportDetailsbyMapping(objId:string){
        return this._http.get(API_URL + this.sportBymappingapiroute + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    saveSportsElementgroup(ElementGroupObj:ElementGroupModel){
        let body=JSON.stringify(ElementGroupObj);
     
        return this._http.post(API_URL + this.elementgroupApiRoute, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSportsElementgroup(perPage:number, currentPage:number, active?:boolean):Observable < SportsElementgroupResponse> {
        // Initialize Params Object
        let query = new HttpParams();
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.elementgroupApiRoute, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
    getSportElementDetailgroup(objId:string):Observable <ElementGroupModel> {
        return this._http.get<ElementGroupModel>(API_URL + this.elementgroupApiRoute + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateSportElementgroup(elementgroupobj:ElementGroupModel) {
        let body = JSON.stringify(elementgroupobj);
        return this._http.put(API_URL + this.elementgroupApiRoute + "/" + elementgroupobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteSportsElementgroup(objDel:ElementGroupModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.elementgroupApiRoute + "/" + objDel._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    saveSportsElement(ElementObj:ElementModel){
        let body=JSON.stringify(ElementObj);
      
        return this._http.post(API_URL + this.elementApiRoute, body)
        .pipe(
            catchError(this.handleError)
        );
    }
    getSportsElement(perPage:number, currentPage:number, active?:boolean):Observable < SportsElementResponse> {
        // Initialize Params Object
        let query = new HttpParams();
        // Begin assigning parameters
        query = query.append('perpage', perPage.toString());
        query = query.append('page', currentPage.toString());
        if(active)
            query = query.append('active', active.toString());
        return this._http.get(API_URL + this.elementApiRoute, {params: query} )
            .pipe(
                catchError(this.handleError)
            );
    }
	getallSportsElement(){
		 return this._http.get(API_URL +'getAllelement' )
            .pipe(
                catchError(this.handleError)
            );
	}
    getSportElementDetail(objId:string):Observable <ElementModel> {
        return this._http.get<ElementModel>(API_URL + this.elementApiRoute + "/" + objId)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateSportElement(elementobj:ElementModel) {
        let body = JSON.stringify(elementobj);
        return this._http.put(API_URL + this.elementApiRoute + "/" + elementobj._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    deleteSportsElement(objDel:ElementModel):Observable<any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.elementApiRoute + "/" + objDel._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }
    // Sport services =========================

    saveSport(objSave:SportModel, file:File):Observable<any> {
   
        return this.xhrService.xhrRequest<SportModel, any>('POST', this.apiRoute, "imageName", objSave, file);
    }

    updateSport(objUpdate:SportModel, file:File, imageDeleted:boolean, sportId: string):Observable<any> {
        return this.xhrService.xhrRequest<SportModel, any>('PUT', this.apiRoute, "imageName", objUpdate, file, sportId, imageDeleted);
    }

    getSportDetail(sportId:string):Observable < SportModel> {
        return this._http.get<SportModel>(API_URL + this.apiRoute + "/" + sportId)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteSport(objSlider:SportModel):Observable < any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.apiRoute + "/" + objSlider._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getSportList(perPage:number, currentPage:number):Observable < SportResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get<SportResponse>(API_URL + this.apiRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Category ===============================

    saveCategory(objSave:CategoryModel) {
        let body=JSON.stringify(objSave);
    
        return this._http.post(API_URL + this.categoryApiRoute, body)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateCategory(objUpdate:CategoryModel):Observable<any> {
        let body = JSON.stringify(objUpdate);
        return this._http.put(API_URL + this.categoryApiRoute + "/" + objUpdate._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }                    

    getCategoryDetail(sportId:string):Observable < CategoryModel> {
        return this._http.get<CategoryModel>(API_URL + this.categoryApiRoute + "/" + sportId)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteCategory(objSlider:CategoryModel):Observable < any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.categoryApiRoute + "/" + objSlider._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getCategoryList(perPage:number, currentPage:number):Observable < CategoryResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get<CategoryResponse>(API_URL + this.categoryApiRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Level ===============================

    saveLevel(objSave:LevelModel) {
   
        let body=JSON.stringify(objSave);

        return this._http.post(API_URL + this.levelApiRoute, body)
        .pipe(
            catchError(this.handleError)
        );
    }

    updateLevel(objUpdate:LevelModel){

        let body = JSON.stringify(objUpdate);
        return this._http.put(API_URL + this.levelApiRoute + "/" + objUpdate._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }                    

    getLevelDetail(sportId:string):Observable < LevelModel> {
        return this._http.get<LevelModel>(API_URL + this.levelApiRoute + "/" + sportId)
            .pipe(
                catchError(this.handleError)
            );
    }

    deleteLevel(objSlider:LevelModel):Observable < any> {
        let body = JSON.stringify({});
        return this._http.patch(API_URL + this.levelApiRoute + "/" + objSlider._id, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getLevelList(perPage:number, currentPage:number):Observable < LevelResponse> {
        let queryString = new HttpParams();
        queryString = queryString.append('perpage', perPage.toString());
        queryString = queryString.append('page', currentPage.toString());
        return this._http.get<LevelResponse>(API_URL + this.levelApiRoute, {params: queryString})
            .pipe(
                catchError(this.handleError)
            );
    }

    

}
