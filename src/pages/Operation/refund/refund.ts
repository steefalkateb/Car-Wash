import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';
import { Observable, empty } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-refund',
  templateUrl: 'refund.html',
})
export class RefundPage {

  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';

  code_number: any;
  loading: any;

  SalesItem: any = [];
  SalesInv: any = [];

  sales_item$: Observable<any[]>;
  sales$: Observable<any[]>;

  refund = new Array()

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public globalvar: GlobalvarProvider, public db: AngularFirestore) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecallPage');
  }
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      duration: 2000,
      message: msg,
      showCloseButton: true,
      position: 'botton',
      // closeButtonText: 'Close'
    });

    toast.present(toast);
  }
  get_data(): Promise<void> {
    return new Promise<void>(async resolve => {
      //////////////////
      if (this.code_number == null || this.code_number == undefined || this.code_number == '') {
        this.showToast('يرجى ادخال رقم الفاتورة');
        return;
      }

      this.sales_item$ = await this.db.collection<any>(this.globalvar.company_name + '_sales_item',
        ref => ref.where("code", "==", Number(this.code_number)).orderBy('no')).valueChanges();



      this.sales$ = await this.db.collection<any>(this.globalvar.company_name + '_sales',
        ref => ref.where("code", "==", Number(this.code_number))).valueChanges();

      await this.sales$.subscribe(result => {
        this.SalesInv = result;
        console.log('111111')
      });

      await this.sales_item$.subscribe(result => {
        if (result.length == 0) {
          this.showToast('رقم الفاتورة خاطئ');
        }
        else {
          this.SalesItem = result;
          console.log(this.SalesItem)

          console.log('3333333')
          resolve()
        }
      });
      /////////////////
    })
  };


  view() {
    this.loading = this.loadingCtrl.create({
      // content: 'Please wait...',
      // duration: 2000,
      dismissOnPageChange: false,
      showBackdrop: true,
      enableBackdropDismiss: true,
      spinner: "bubbles"
    })
    this.loading.present();
    this.refund = []
    this.get_data()

    this.loading.dismiss();

  }

  updateCucumber(event: any, row: any) {
    // console.log(event.checked)
    // console.log(row)
    if (event.checked == true) {
      this.refund.push(row)
    }
    else {
      for (let i = 0; i < this.refund.length; i++) {
        if (this.refund[i].no == row.no) {
          this.refund.splice(i, 1)
        }
      }
    }
  }

  done() {
    // console.log(this.refund)
    for (var i = 0; i < this.refund.length; i++) {
      console.log(this.refund[i])

      this.refund[i].unix = firebase.firestore.Timestamp.now().toMillis()
      this.db.collection<any>(this.globalvar.company_name + '_refund').add(this.refund[i]);
    }
    this.sales_item$ = new Observable<any[]>();
  }


  //////////////////////////////////Table/////////////////////////////////////////////////
  // https://devdactic.com/ionic-datatable-ngx-datatable/

  switchStyle() {
    // https://devdactic.com/ionic-datatable-ngx-datatable/
    if (this.tablestyle == 'dark') {
      this.tablestyle = 'bootstrap';
    } else {
      this.tablestyle = 'dark';
    }
  }

  onClick() {
    // console.log('22222222222222')

    // this.sales_item$.subscribe(result => {
    //   for (var i = 0; i < result.length; i++) {
    //     console.log(this.sales_item$[i])
    //     this.sales_item$[i] = ({ 'sss': 'ssss' })[i];
    //     console.log(this.sales_item$[i])
    //     console.log('545465456')
    //   }
    // })
  }
  //////////////////////////////////Table/////////////////////////////////////////////////
}
