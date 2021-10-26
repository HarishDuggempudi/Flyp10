import { AfterViewInit, Component, Inject, PLATFORM_ID } from "@angular/core";
import {isPlatformBrowser} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import { CloudinaryService } from "../admin-app/dashboard-app/components/cloudinary/cloudinary.service";
import { Config } from "../admin-app/shared/configs/general.config";
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs/Subscription';
declare const ga:any;

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})

export class AppComponent {

    private popupOpenSubscription: Subscription;
    private popupCloseSubscription: Subscription;
    private initializeSubscription: Subscription;
    private statusChangeSubscription: Subscription;
    private revokeChoiceSubscription: Subscription;
    private noCookieLawSubscription: Subscription;

    constructor(private cloudinaryService:CloudinaryService, private ccService: NgcCookieConsentService,@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router) {

    }

    ngAfterViewInit(): void {
        this.router.events.subscribe(event => {
          // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
          if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
            console.log('google analytics function', ga); // Just to make sure it's actually the ga function
            ga('set', 'page', event.urlAfterRedirects);
            ga('send', 'pageview');
          }
        });
      }

    ngOnInit() {
        this.setCloudinaryName();
        // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
        () => {
          // you can use this.ccService.getConfig() to do stuff...
        //  console.log('get config open subs ', this.ccService.getConfig())
        });
   
      this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
        () => {
          // you can use this.ccService.getConfig() to do stuff...
        //  console.log('get config close subs ', this.ccService.getConfig())

        });
   
    //   this.initializeSubscription = this.ccService.initialize$.subscribe(
    //     (event: NgcInitializeEvent) => {
    //       // you can use this.ccService.getConfig() to do stuff...
    //     });
   
    //   this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
    //     (event: NgcStatusChangeEvent) => {
    //       // you can use this.ccService.getConfig() to do stuff...
    //     });
   
    //   this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
    //     () => {
    //       // you can use this.ccService.getConfig() to do stuff...
    //     });
   
    //     this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
    //     (event: NgcNoCookieLawEvent) => {
    //       // you can use this.ccService.getConfig() to do stuff...
    //     });
    }

    ngOnDestroy() {
        // unsubscribe to cookieconsent observables to prevent memory leaks
        this.popupOpenSubscription.unsubscribe();
        this.popupCloseSubscription.unsubscribe();
        // this.initializeSubscription.unsubscribe();
        // this.statusChangeSubscription.unsubscribe();
        // this.revokeChoiceSubscription.unsubscribe();
        // this.noCookieLawSubscription.unsubscribe();
      }

    setCloudinaryName() {
        this.cloudinaryService.getCloudinarySettings()
            .subscribe(res=>Config.setCloudinary(res.cloudinaryCloudName, res.cloudinaryApiKey, res.cloudinaryApiSecret),
                err=>this.handleErrorMsg(err));
    }

    handleErrorMsg(res:any) {
       // console.log(res.message);
    }

}