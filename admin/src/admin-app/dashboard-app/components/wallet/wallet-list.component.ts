import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import Swal from "sweetalert2";
import { RegisterUserModel, UserResponse } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";
import { WalletService } from "./wallet.service";
import { WalletModel, DefaultCard } from "./wallet.model";
import { UserService } from "../user-management/user.service";
import * as moment from 'moment';
import { JudgesHistoryTableComponent } from './judges-history-table.component';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PricingSettingService } from "../pricing/pricing-setting.service";
import { PromocodeComponent } from "../promocode/promocode";
import { PromocodeService} from '../promocode/promocode.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
declare var PayWithConverge: any;
@Component({
  selector: "wallet-list",
  templateUrl: "./wallet-list.html",
  styles: ['./wallet.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WalletComponent implements OnInit {
  navLinks: any[] = [
    { label: 'Transaction History', path: '/wallet' },
    { label: 'Remittance History', path: '/wallet/remittance' }
  ];
  loginobjUser: RegisterUserModel = new RegisterUserModel();
  objUser: RegisterUserModel = new RegisterUserModel();
  walletObj: WalletModel = new WalletModel();
  defaultCard: DefaultCard = new DefaultCard();
  transaction: any = [];
  PromocodeDetails:any;
  remit: boolean = false;
  remitSliderVal: number;
  walletAmount: string = "5.60";
  CID: number;
  accountInfo: any = {};
  CardDetails: any[];
  userList: any;

  filteredOptions: any = [];
  elementval: any = [];
  sessionToken: any;
  subscription;
  credit;
  amount: any;
  creditForm: FormGroup;
  isCreditFormSubmitted = false;
  type: any;
  amountcode: string;
  subtype: string;
  selectedpackage;
  promocode;
  address;
  zip
  constructor(private router: Router, private walletservice: WalletService, public pricing: PricingSettingService, private _objUserService: UserService, private _formBuilder: FormBuilder,public dialog: MatDialog,public promoservice:PromocodeService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginobjUser = userInfo;
    this.creditForm = this._formBuilder.group({
      selectedpackage: ['2'],
      amount: [''],
      promocode:[''],
      zip:['',Validators.required],
      address:['',Validators.required]

    })
    //   console.log('user inforrrrrrrrrrrrrrrrrrrr ', this.loginobjUser);
  }
  ngOnInit() {
    this.getUsersList()
    this.getccinfo()
    this.getPaylianceCIDbyUID();
    this.getUserDetail();
    this.getMywalletinfo();
    this.getMytransaction();
    this.getPricing()
    // this.getSessionTokenForHPP()

  }
  getSessionTokenForHPP() {
    return new Promise((resolve, reject) => {
      
      let data = {
        amount: this.amount,
        userid: this.objUser._id,
        firstName:this.objUser.firstName?this.objUser.firstName:'',
        lastName:this.objUser.lastName?this.objUser.lastName:'',
        address:this.address?this.address:'',
        zip:this.zip?this.zip:''
      }

      console.log(this.amount, data)
      this.walletservice.getSessionTokenForHPP(data).subscribe((res) => {
        if (res.success) {
          this.sessionToken = res.data;
          //this.sessionToken ='nnyBK2KFTkmIGUSdLLWjfgAAAXT4+7fp'
          resolve();
        }
        else {
          resolve();
        }

      })

    })

  }
  Promocode(){
    console.log("userdetail",this.objUser)
 const dialogRef = this.dialog.open(PromocodeComponent, {
      width: '400px',height:"200px",maxHeight:'200px'
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    
    });
  
  }
  doFilter(event) {

    if (event != '') {
      this.filteredOptions = this.userList.filter(element => element.username.toLowerCase().includes(event.toLowerCase()))

    } else {
      this.filteredOptions = []
    }

  }
  // onUserChange(user){
  //   console.log('user',user)
  //   this.referralForm.get('referrer').setValue(user)
  //   console.log('referrer', this.referralForm.value.referrer)
  // }
  getUsersList() {
    this._objUserService.getAllCompetitor(1000, 1).subscribe(res => {
      console.log('userslist', res)

      this.userList = res.dataList
      // this.filteredOptions = this.userList
    })
  }
  formatDollar(val) {
    if (val) {
      var amt = val.toString();
      if (amt.indexOf('.') != -1) {
        return Number(amt).toFixed(2)
      } else {
        return amt + '.00'
      }
    }
    else {
      return '0.00'
    }

  }
  getPaylianceCIDbyUID() {
    this._objUserService.getPaylianceCIDbyUID(this.loginobjUser._id).subscribe(res => {
      // console.log('response from CIDDDD ', res);
      this._objUserService.paylianceCIDinfo = res;
      // console.log('this._objUserService.paylianceCIDinfo ====> ', this._objUserService.paylianceCIDinfo);
    }, err => {
      // console.log('error ', err);
    })
  }

  submitRemitRequest() {
    //console.log('CIDDDDDDDDDD ', this._objUserService.paylianceCIDinfo);
    if (this._objUserService.paylianceCIDinfo) {
      this._objUserService.getPaylianceAccountsByCID(this._objUserService.paylianceCIDinfo).subscribe(response => {
        // console.log('payliance account response ', response);
        // this.accountInfo = response['response'].Response
        if (response['success'] === true) {
          // console.log('ACC RES ', response);
          let defaultAccount;
          Array.isArray(response['response']) ? defaultAccount = response['response'][0] : defaultAccount = response['response'];
          // console.log('default account ', defaultAccount);
          // Save request to proceed 
          const dataToPost = {
            AID: defaultAccount.MethodID._,
            UID: this.loginobjUser._id,
            username: this.loginobjUser.username,
            CID: this._objUserService.paylianceCIDinfo[0].CID,
            type: 0,
            amount: this.remitSliderVal
          }

          //  console.log('data to post ', dataToPost);

          this._objUserService.submitRemitRequest(dataToPost).subscribe(res => {
            //  console.log("response from the server ", res);
            if (res['success'] === true) {
              this.remit = false;
              Swal("Request submitted successfully!", `Your request for remitance of $ ${this.remitSliderVal} to your default account ${defaultAccount.Account._} has been submitted. We will let you know once the admin responds to the request!`, "success");
            } else {
              Swal("Request already submitted!", `Please wait until the admin responds to submit and process a new request!`, "error");
            }

          })

        } else {
          Swal("Default account to remit payment not found!", "You do not have a default account set for payments! Please add a new account under My Profile > Account Info and try again!", "info");
        }
      })
    }
  }
  getPromocode(id){
    console.log("id",this.objUser)
  this.promoservice.getPromocodeDetail(id).subscribe(res=>{
    
    this.PromocodeDetails=res
    console.log("promocodedetails",this.PromocodeDetails)
  })
  }
  UpdatePromocode(promocode){
  const dialogRef = this.dialog.open(PromocodeComponent, {
        width: '250px',
        data:{name:promocode}
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      
      });
  }
  formatdate(date) {
    if (date) {
      return moment(new Date(date)).format('L');
    } else {
      return "";
    }

  }
  getUserDetail() {
    this._objUserService.getUserDetail(this.loginobjUser._id)
      .subscribe(resUser => {
        // console.log(resUser);
        this.objUser = resUser;
        this.getPromocode(this.objUser._id);
      },
        error => this.errorMessage(error));
  }
  getMywalletinfo() {
    this.walletservice.getWalletInfo(this.loginobjUser._id).subscribe(res => {
      // console.log(res);
      if (res.length > 0) {
        this.walletObj = res[0];
        //  console.log('wallet info ', this.walletObj);
        //this.walletObj.balance = "60";
      }

    }, err => {
      this.errorMessage(err)
    })
  }
  getPricing() {
    this.subscription = []
    this.credit = []
    this.pricing.getPricing().subscribe(data => {

      this.credit = data[0].addCredits;
      this.credit = this.credit.split(',');
      this.subscription.push(data[0].premium, data[0].premiumPlus)

      this.amount = data[0].premium

    })
  }
  onAmountChange(event) {
    //this.amount=event.value
    if (this.amount == '25') {
      this.amountcode = 'AF 0025'
    }
    else if (this.amount == '50') {
      this.amountcode = 'AF 0050'
    }
    else if (this.amount == '100') {
      this.amountcode = 'AF 0100'
    }

  }
  getMytransaction() {
    this.walletservice.getTransactionInfo(this.loginobjUser._id).subscribe(res => {
      // console.log(res);
      this.transaction = res;
      this.transaction = this.transaction.reverse();
      //this.transaction=this.transaction.sort((a, b) => new Date(b.txn_date).getTime() - new Date(a.txn_date).getTime())
    }, err => {
      this.errorMessage(err)
    })
  }

  errorMessage(objResponse: any) {
    if (objResponse.message) {
      Swal("Alert !", objResponse.message, "info");
    }
    else {
      Swal("Alert !", objResponse, "info");
    }

  }
 
  async addCredits(type) {
    this.type = type;
    //  await this.getSessionTokenForHPP();
    // window.open("http://demo.flyp10.com/admin/wallet/HPP", "_blank");
    //window.location.href = "https://api.demo.convergepay.com/hosted-payments/?ssl_txn_auth_token="+this.sessionToken;
    // this.router.navigate(["/wallet/HPP"]);

    //  if(this.defaultCard.token){
    //   this.router.navigate(["/wallet/editor",type]);
    //  }else{
    //   Swal("Default Card Not Selected!", `Please select a default card from Profile -> Saved cards  `, "warning");

    //  }

  }
  onPackageChange(event) {
    this.amount = event.value;
    if (this.amount == this.subscription[0]) {

      this.amountcode = 'Pre ' + this.amount

    }
    else if (this.amount == this.subscription[1]) {
      this.amountcode = 'PrePlus ' + this.amount
    }
  }
  async paycredit() {
    this.isCreditFormSubmitted = true;

    if (this.creditForm.valid) {
     
      await this.getSessionTokenForHPP();
      if (this.sessionToken) {
        document.getElementById('close').click();
        var paymentFields = {
          ssl_txn_auth_token: this.sessionToken
        };
        var callback = {
          onError: (error) => {
            this.showResult("error", error);

          },
          onCancelled: () => {
            this.showResult("cancelled", "");

          },
          onDeclined: (response) => {
            this.showResult("declined", response);

          },
          onApproval: (response) => {
            this.showResult("approval", response);

          }
        };
        PayWithConverge.open(paymentFields, callback);


        // window.location.href = "https://api.demo.convergepay.com/hosted-payments/?ssl_txn_auth_token="+this.sessionToken;
      }
      else {
        document.getElementById('close').click();
        this.zip =''
        this.address =''
        this.isCreditFormSubmitted = false
        Swal("Error occured,while getting the sessiontoken", `Please try again`, "warning");
      }
    }
  }
  Remit() {
    this.remit = true;
  }
  showResult(status, res) {
    console.log('show result', status, res)
    //if()
   // res = { "ssl_issuer_response": "00", "ssl_partner_app_id": "0s1", "ssl_card_number": "40**********0002", "ssl_oar_data": "010010212210141610330000047554200000000000934271028816102122", "ssl_transaction_type": "SALE", "ssl_transaction_reference_number": "1014161033", "ssl_result": "0", "ssl_txn_id": "141020AD4-A6189F20-B283-4A93-8CA2-998929C5461D", "ssl_avs_response": " ", "ssl_approval_code": "934271", "ssl_salestax": "0.00", "ssl_amount": "25.00", "ssl_txn_time": "10/14/2020 12:10:33 PM", "ssl_account_balance": "0.00", "ssl_ps2000_data": "A7502885823391945100VE", "ssl_exp_date": "1220", "ssl_result_message": "APPROVAL", "ssl_card_short_description": "VISA", "ssl_card_type": "CREDITCARD", "ssl_invoice_number": "1234", "ssl_cvv2_response": "N" }
this.zip =''
this.address = ''
this.isCreditFormSubmitted = false
      if (res.ssl_result == 0) {
        let promocode='0'
									 								
										promocode=this.creditForm.value.promocode?this.creditForm.value.promocode:'0';
									  
        this.showSuccessAlert(res.ssl_txn_id, res.ssl_amount.split('.')[0], res.ssl_result_message, res.ssl_card_number);
        this.saveResponse(res);
        this.saveTransaction(res, this.type, promocode);

        if (this.type == '1') {
          this.creditwallet(res);
        } else {
          this.addSubscription();
        }
      }
      else if (res.errorCode) {
        this.saveConvergeErrorResponse(res);
        Swal("Failed !", "Error Code:" + res.errorCode + "<br>" + res.errorName, "error");

      }
      else {
        if (res.ssl_txn_id) {
          this.saveResponse(res);
        }
        Swal("Transaction Cancelled", "", "error");

      }


    
 //   Swal("Alert !", 'Status:' + status + ',Message:' + res, "info");
  }
  creditwallet(response) {
    if (response.ssl_amount) {
     // let amount = response.ssl_amount.spilt('.')[0]
      let walletObj = {
        "type": 'c',
        "userid": this.objUser._id,
        "balance": response.ssl_amount.split('.')[0]
      }
      this.walletservice.creditUserWallet(walletObj).subscribe(res => {
        this.getMywalletinfo();
      }, err => {

      })
    }

  }
  saveConvergeErrorResponse(response) {
    response.userid = this.objUser._id

    this.walletservice.saveConvergeErrorResponse(response).subscribe(res => {

    }, err => {

    })
  }
  addSubscription() {
    if (this.amount == this.subscription[0]) {
      this.subtype = '2'
    } else if (this.amount == this.subscription[1]) {
      this.subtype = '3'
    }
    var type = '';
    var start = new Date();
    var aYearFromNow = new Date();
    var promocode =this.creditForm.value.promocode;
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    
      type = this.subtype;
      //promocode = '';
    
    var convergeObj = {
      updateToken: '0',
      subtype: type,
      subStart: start.toString(),
      subEnd: aYearFromNow.toString(),
      username: this.objUser.username,
      promocode: promocode
    }
    this.walletservice.updateConvergeInfo(convergeObj, this.objUser._id)
      .subscribe(res => {
      }, err => {
        this.errorMessage(err);
      }
      )
  }
  saveTransaction(response, selpackage, promocode) {
    var desc = '';
    if (selpackage == '1') {
      desc = "Account fillup - $ " + response.ssl_amount
    }
    else if (selpackage == '2') {
        var ptype = this.creditForm.value.selectedpackage
        if (ptype == '2') {
          desc = "premium subscription - $ " + response.ssl_amount 
        }
        else {
          desc = "premium plus subscription - $ " + response.ssl_amount 
        }
    }
    else {
      desc = selpackage
    }
    var transactionObj = {
      userid: this.objUser._id,
      txn_amount: response.ssl_amount.split('.')[0],
      txn_type: 'c',
      txn_id: response.ssl_txn_id,
      txn_token: response.ssl_token,
      txn_desc: desc,
      txn_date: response.ssl_txn_time,
      promocode: promocode
    }
    this.walletservice.saveTransaction(transactionObj).subscribe(res => {
      this.getMytransaction();
      
    }, err => {

    })
  }
  showSuccessAlert(id, amount, status, number) {
    Swal({
      title: '<strong>Success</u></strong>',
      type: 'success',
      html:
        '<div">' +
        '<div class="row"><label class="col-md-4" style="font-size:14px;">Card Number :</label><b class="col-md-8" style="font-size:14px;text-align:right;">' + number + '</b></div><br>' +
        '<div class="row"><label class="col-md-4" style="font-size:14px;">Amount :</label><b class="col-md-8" style="font-size:14px;text-align:right;">$ ' + amount + '.00</b></div><br> ' +
        '<div class="row"><label class="col-md-4" style="font-size:14px!important;">Transaction ID :</label><b class="col-md-8" style="font-size:14px;text-align:right;">' + id + '</b></div><br> ' +
        '<div class="row"><label class="col-md-4" style="font-size:14px;">Status :</label><b class="col-md-8" style="font-size:14px;text-align:right;">' + status + '</b></div></div> '
      ,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'OK',
      confirmButtonAriaLabel: 'OK',

    })
  }
  cancelRemitance() {
    this.remit = false;
    this.remitSliderVal = 0.00;
  }
  saveResponse(response: any) {
    // response['userid']=this.objUser._id;
    response.userid = this.objUser._id
    this.walletservice.saveConvergeResponse(response).subscribe(res => {

    }, err => {

    })

  }
  onRemitSliderChange(ev) {
    // console.log('event tg val ', ev.value)
    this.remitSliderVal = ev.value
  }
  getccinfo() {
    this.CardDetails = [];
    this._objUserService.getccinfo(this.loginobjUser._id).subscribe(res => {

      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          this._objUserService.getinfobyToken(res[i].token).subscribe(result => {

            if (result.response.txn) {
              if (result.response.txn.ssl_result == 0) {

                this.pushcarddetails(result.response.txn, res[i].isdefault, res[i]._id, res[i].token);
              }
            }
          }, error => {
            this.errorMessage(error);
          })
        }
      } else {

      }
    }, err => this.errorMessage(err))
  }
  pushcarddetails(response, isdefault, docid, token) {
    response.isdefault = isdefault;
    response.docid = docid;
    response.token = token;
    this.CardDetails.push(response);
    if (isdefault) {
      this.defaultCard.token = token;
      this.defaultCard.cardNumber = response.ssl_account_number;
      this.defaultCard.cardType = response.ssl_card_type;
    }
  }


  onKeyUp(ev) {
    let temp = [];
    temp = this.userList.filter(item => item.username.include(ev.target.value));
    if (temp.length > 0) {


    }
  }
}
