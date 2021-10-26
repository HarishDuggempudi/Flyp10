import { BlogModel } from '../../../admin-app/dashboard-app/components/blog/blog.model';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID, ViewChild } from "@angular/core";
import { BlogService } from "../../../admin-app/dashboard-app/components/blog/blog.service";
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { Config } from '../../../admin-app/shared/configs/general.config';
import { Services } from '../../shared/services';
import {FaqComponent} from '../landing/faq.component'
import {PrivacyPage} from '../landing/privacy.component'
const TAGS_KEY = makeStateKey('blogTagsList');
const BLOG_KEY = makeStateKey('blogDetail');
import {TermsPage} from '../../components/landing/conditons.component'
import {VideoService} from '../../../admin-app/dashboard-app/components/videoUploadPage/video.service';
import {VideoModel} from '../../../admin-app/dashboard-app/components/videoUploadPage/video.model';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { PricingSettingService } from '../../../admin-app/dashboard-app/components/pricing/pricing-setting.service';


@Component({
    selector: 'client-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit{
  
    blogTagsList: any[] = [];
    blogId: string = '5ab4d835ff222b141d3a81de';
    blogDetail: BlogModel;
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";
    testimonials:any[] = [];
    banner:VideoModel=new VideoModel();
    credit: any;
    subscription: any;
    premium: any;
    premiumPlus: any;
	pricelist:any=[];
    constructor(@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(BlogService)private blogService: BlogService, @Inject(TransferState)private state: TransferState, private _service: Services,private videoservice: VideoService,public pricing: PricingSettingService) { }
    
    ngOnInit() {      
       this. getPricing()
        this.setSeoTags();
        this.getBanner();
        this.getTestimonialsData();
        const platform = isPlatformBrowser(this.platformId);
        if(platform)

        this.blogTagsList = this.state.get(TAGS_KEY, null as any);
        this.blogDetail = this.state.get(BLOG_KEY, null as any);        
        if(!this.blogTagsList){
            this.getBlogTags();
        }
        if(!this.blogDetail)
            this.getBlogDetail();
    }

    getTestimonialsData(){
        this._service.getTestimonialsData().subscribe( data => {
            
            this.testimonials = data['dataList'];
           // console.log('testimonials data ',this.testimonials );
        })
    }
    redirect(){
        if(/:\/\/([^\/]+)/.exec(window.location.href)[1]=='demo.flyp10.com'){
            window.location.replace('http://demo.flyp10.com/admin/login')
        }else{
            window.location.replace('https://flyp10.com/admin/login')
        }
        
    }
    getBanner(){
        this.videoservice.getBannerbyID("1").subscribe(
            res=>{
               // console.log(res)
                if(res.length>0){
                    this.banner=res[0];
                }
               
            },err=>{
               // console.log(err)
            }
        )
    }
	subEnquiry(){
		this._service.saveContact().subscribe(res=>{
			//console.log(res)
		},err=>{
			//console.log(err)
		})
	}
    setSeoTags() {
        this.seo.setTitle("Flyp10 | Home");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
    }

    getBlogDetail() {
        this.blogService.getBlogDetail(this.blogId)
            .subscribe(res => {
                this.blogDetail = res;
                this.blogDetail.bannerImage = this.getImgSrc(this.blogDetail.bannerImage);
                this.state.set(BLOG_KEY, this.blogDetail as any);
            });
    }
    
    formatDollar(val){ 
 
        if(val && val!='N/A'){ 
             var amt=val.toString(); 
             if(amt.indexOf('.')!=-1){ 
                return "$ "+Number(amt).toFixed(2) 
             }else{ 
                 return "$ "+amt+'.00' 
             } 
        } 
        else if(val=='N/A') { 
              return val
        } 
		 else { 
              return '$ 0.00' 
        } 
    }
    getImgSrc(image: string) {
        return Config.Cloudinary.url(image, {height: 300, width:1050, crop: 'fill' }); 
    }

    getBlogTags() {
        this.blogService.getBlogTagList()
            .subscribe(res => { 
                this.blogTagsList = res;
                this.state.set(TAGS_KEY, this.blogTagsList as any);
            });
    }

    getPricing(){
      
        this.pricing.getPricing().subscribe(data=>{
    
            this.credit=data[0].addCredits;
            this.credit=this.credit.replace(/,/g,'/')
            this.premium=data[0].premium;
            this.premiumPlus=data[0].premiumPlus
            
    
     
            
        })
    }
	getSportPricing(){
   //alert("call")
  
      this._service.getPricingList().subscribe( 
            res =>{
               
               this.pricelist=res
               this.pricelist.sort(function(a,b){
                return a.sport.localeCompare(b.sport);
            })
               
            },
            error => {
				  //this.errorMessage(error)
				
				}
          );
      
}
}


