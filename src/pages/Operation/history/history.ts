import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';

declare let BTPrinter: any;


@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})

export class HistoryPage {
  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';

  code_number: any;
  SalesItem: any = [];
  SalesInv: any = [];

  sales_item$: Observable<any[]>;
  sales$: Observable<any[]>;
  company_name: string;
  vat_id: string;
  line_1: string;
  line_2: string;
  loading: any;
  path_image: string = "./assets/imgs/logo.png";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globalvar: GlobalvarProvider, public db: AngularFirestore,
    private alertCtrl: AlertController, public datepipe: DatePipe,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.path_image = this.globalvar.path_image;
    this.company_name = this.globalvar.company_name;
    this.vat_id = this.globalvar.vat_id;
    this.line_1 = this.globalvar.line_1;
    this.line_2 = this.globalvar.line_2;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
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
        ref => ref.where("code", "==", Number(this.code_number))).valueChanges();



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
          this.print()
          console.log('3333333')
          resolve()
        }
      });
      /////////////////
    })
  };


  async view() {



    if (this.code_number == null || this.code_number == undefined || this.code_number == '') {
      this.showToast('يرجى ادخال رقم الفاتورة');
      return;
    }

    this.loading = this.loadingCtrl.create({
      // content: 'Please wait...',
      // duration: 2000,
      dismissOnPageChange: false,
      showBackdrop: true,
      enableBackdropDismiss: true,
      spinner: "bubbles"
    })
    this.loading.present();

    this.sales_item$ = await this.db.collection<any>(this.globalvar.company_name + '_sales_item',
      ref => ref.where("code", "==", Number(this.code_number))).valueChanges();

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

      }
    });
    this.loading.dismiss();

  }



  async print() {


    this.loading = this.loadingCtrl.create({
      // content: 'Please wait...',
      // duration: 2000,
      dismissOnPageChange: false,
      showBackdrop: true,
      enableBackdropDismiss: true,
      spinner: "bubbles"
    })

    this.loading.present();



    var printData: string = '';

    // await this.get_data()

    let x = new Date(this.SalesInv[0].unix)
    const date = this.datepipe.transform(x, 'mm:HH yyyy-MM-dd');

    printData += '\x1B\x61\x02';//right




    // /////////////////////////image_center///////////////////////////////////////////////
    BTPrinter.printBase64(function(data) {
      console.log("Success");
      console.log(data);
    }, function(err) {
      console.log("Error");
      console.log(err);
    }, this.path_image, '1');
    // // ////////////////////////////////date//////////////////////////////////////////
    printData += '\x1B\x21\x20';//bold
    printData += '\x1B\x61\x01';//center
    if (this.company_name != '' || this.company_name != null || this.company_name != undefined) {
      printData += this.company_name + '\n';

    }

    printData += this.vat_id + '\n';

    printData += '\x1B\x61\x02';//right
    printData += '\x1B\x21\x08';
    printData += 'رقم الفاتورة : ' + this.SalesInv[0].code + '\n';

    printData += 'التاريخ : ' + date + '\n';

   printData += this.SalesInv[0].username + ' : ' + 'اسم المستخدم' + '\n';

    printData += '\x1B\x21\x10';//size
    printData += '\x1B\x21\x20';//bold
    printData += '\x1B\x61\x02';//right
    printData += '************************************\n';

    printData += '\x1B\x21\x20';//bold




    for (var xx = 0; xx < this.SalesItem.length; xx++) {
      printData += this.SalesItem[xx].groupname + ' - ';
      printData += this.SalesItem[xx].itemname + '\n';
      printData += '   ' + this.SalesItem[xx].price + ' '  + '\n'
    }


    var su1, su2: string;
    var ta1, ta2: string;
    var to1, to2: string;

    su1 = Math.trunc(Number(this.SalesInv[0].subtotal));
    su2 = String(Number(this.SalesInv[0].subtotal) - Number(su1));
    su2 = Number(su2).toFixed(2)

    ta1 = Math.trunc(Number(this.SalesInv[0].tax));
    ta2 = String(Number(this.SalesInv[0].tax) - Number(ta1));
    ta2 = Number(ta2).toFixed(2)

    to1 = Math.trunc(Number(this.SalesInv[0].total));
    to2 = String(Number(this.SalesInv[0].total) - Number(to1));
    to2 = Number(to2).toFixed(2)


    printData += '************************************\n';

    // printData += 'الصافي : '
    // printData += su2.substring(2, 4) + '.' + su1 + ' ' + 'ريال' + '\n';

    // printData += 'الضريبة :   '
    // printData += ta2.substring(2, 4) + '.' + ta1 + ' ' + 'ريال' + '\n';

    // printData += 'المجموع : '
    // printData += to2.substring(2, 4) + '.' + to1 + ' ' + 'ريال' + '\n';
    // printData += '\n \n \n';

    printData += 'الاجمالي قبل الضريبة : '
    printData += su2.substring(2, 4) + '.' + su1 + '\n';

    printData += 'ضريبة القيمة المضافة :   '
    printData += ta2.substring(2, 4) + '.' + ta1 + '\n';

    printData += 'الاجمالي بعد الضريبة : '
    printData += to2.substring(2, 4) + '.' + to1 + '\n';

    printData += '************************************\n';

    printData += '\x1B\x61\x01';//center

    printData += this.line_1 + '\n';
    printData += this.line_2 + '\n';

    printData += '\n \n \n';

    
    BTPrinter.printText(function(data) {
      console.log(data)
    }, function(err) {
      console.log("Error");
      console.log(err)
    }, printData)


    this.loading.dismiss();

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
  //////////////////////////////////Table/////////////////////////////////////////////////
}
