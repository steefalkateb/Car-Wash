import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalvarProvider } from '../../providers/globalvar/globalvar';
import * as firebase from 'firebase/app';

import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common'
import { Events } from 'ionic-angular';
import * as moment from 'moment';


declare let BTPrinter: any;

@IonicPage()
@Component({
  selector: 'page-purchases',
  templateUrl: 'purchases.html',
})
export class PurchasesPage {
  items: any = [];

  sales_item: any = {}

  loading: any;

  sales: any = {}


  Subtotal: string;
  Tax: string;
  Total: string;
  path_image: string = "./assets/imgs/logo.png";
  add_tax_button_1: boolean;
  company_name: string;
  event1 = { Time: new Date().toISOString(), allDay: false };
  preselectedDate = moment(this.navParams.get('selectedDay')).format();

  user_login_buy: string;

  vat_id: string;
  line_1: string;
  line_2: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private sqlite: SQLite,
    public modlCtrl: ModalController, public db: AngularFirestore,
    public globalvar: GlobalvarProvider, public loadingCtrl: LoadingController,
    public storage: Storage, public datepipe: DatePipe,
    public events: Events, public toastCtrl: ToastController,
    private alertCtrl: AlertController) {

    this.path_image = this.globalvar.path_image;
    this.add_tax_button_1 = this.globalvar.add_tax;
    this.company_name = this.globalvar.company_name;
    this.user_login_buy = this.globalvar.user_login;
    this.vat_id = this.globalvar.vat_id;
    this.line_1 = this.globalvar.line_1;
    this.line_2 = this.globalvar.line_2;
    console.log(this.add_tax_button_1)
    console.log(this.globalvar.number_copies + '?????')

    this.create_table();


    console.log(this.user_login_buy)

  }
  showToast(msg: string) {
    let toast = this.toastCtrl.create({

      duration: 2000,
      message: msg,
      showCloseButton: true,
      position: 'botton',
      // cssClass: 'toast-container'
      // closeButtonText: 'Close'
    });

    toast.present(toast);
  }

  async presentAlert() {
    // try {
    alert("طباعة نسخة أخرى");
    const coffee = console.log('123');

    // alert(coffee); // ☕

    // const wes =   console.log('123456');
    // alert(wes);

    // const wordPromise = .

    //  console.log('123456789');
    // alert(wordPromise);

    // alert("finish");
    // } catch (e) {
    //   console.error(e); // 💩
    // }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchasesPage');
    // var a1: number = 38.10;
    // var a2: number = 1.90;
    // l = 3.30
    // l = Math.trunc(l)
    // // Number.parseFloat(l).toFixed(2);
    // console.log(l)

    // var to1, to2: string
    // to1 = Number.parseFloat(l).toFixed(0);
    // to2 = String(Number(l) - Number(to1));
    // console.log(to1)
    // console.log(to2)

    // var ta1: number = 40;
    // var ta2: number

    // // ta1 = Math.trunc(Number('1.90'));
    // ta2 = Number('40') - ta1
    // console.log(ta2.toFixed(2))
  }
  create_table() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        // db.executeSql('CREATE TABLE IF NOT EXISTS sales_item(item_name TEXT, qty TEXT, price TEXT, total TEXT, group TEXT)', [])
        db.executeSql('CREATE TABLE IF NOT EXISTS sales_item(id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, qty TEXT, price TEXT, total TEXT, group_name TEXT, imageurl TEXT)', [])
          .then(() => {
            console.log('Hi M,MMMMMMMMMM Executed SQL')
            db.executeSql('SELECT * FROM sales_item ORDER BY id', [])
              .then(res => {
                console.log('EXECUTED SQL SELECT done');
                this.items = [];
                var tot: number = 0;
                for (var index = 0; index < res.rows.length; index++) {
                  // console.log('indexxxxxxxxxxxx' + index);
                  this.items.push({
                    id: res.rows.item(index).id,
                    itemname: res.rows.item(index).item_name,
                    qty: res.rows.item(index).qty,
                    price: res.rows.item(index).price,
                    total: res.rows.item(index).total,
                    groupname: res.rows.item(index).group_name,
                    imageurl: res.rows.item(index).imageurl,
                    // username:res.rows
                  })

                  tot = tot + Number(res.rows.item(index).total);
                }
                this.Total = tot.toFixed(2);
                console.log(tot.toFixed(2))

                if (this.add_tax_button_1 == true) {
                  this.Tax = String(tot * 5 / 105);
                  this.Tax = Number(this.Tax).toFixed(2)
                  console.log(this.add_tax_button_1)

                }
                else {
                  this.Tax = '0'
                  console.log(this.add_tax_button_1 + '8888')

                }


                this.Subtotal = String(Number(this.Total) - Number(this.Tax));
                this.Subtotal = Number(this.Subtotal).toFixed(2);

                console.log(this.items);
              })
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
  }

  /////////////////////////Print////////////////////////////////////
  print_text(): Promise<void> {
    return new Promise<void>(resolve => {
      //////////////////
      // https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter/
      var printData: string = '';


      let x = new Date()
      const date = this.datepipe.transform(x, 'mm:HH yyyy-MM-dd');

      // const date = moment().format('mm:HH yyyy-MM-dd');

      /////////////////////////image_center///////////////////////////////////////////////
      BTPrinter.printBase64(function(data) {
        console.log("Success");
        console.log(data);
      }, function(err) {
        console.log("Error");
        console.log(err);
      }, this.path_image, '1');
      //////////////////////////////date//////////////////////////////////////////
      printData += '\x1B\x21\x20';//bold
      printData += '\x1B\x61\x01';//center
      if (this.company_name != '' || this.company_name != null || this.company_name != undefined) {
        printData += this.company_name + '\n';

      }
      printData += '\x1B\x21\x10';//size

      printData += this.vat_id + '\n';


      printData += '\x1B\x61\x02';//right
      printData += '\x1B\x21\x08';//size
      printData += 'رقم الفاتورة :  ' + this.globalvar.no_inv + '\n'

      printData += 'التاريخ : ' + date + '\n';

      printData += '\x1B\x61\x02';//right

      printData += this.globalvar.user_login + ' : ' + 'اسم المستخدم' + '\n';

      printData += '\x1B\x21\x10';//size
      printData += '\x1B\x21\x20';//bold
      printData += '\x1B\x61\x02';//right
      printData += '************************************\n';

      var su1, su2: string;
      var ta1, ta2: string;
      var to1, to2: string;

      su1 = Math.trunc(Number(this.Subtotal));
      su2 = String(Number(this.Subtotal) - Number(su1));
      su2 = Number(su2).toFixed(2)

      ta1 = Math.trunc(Number(this.Tax));
      ta2 = String(Number(this.Tax) - Number(ta1));
      ta2 = Number(ta2).toFixed(2)

      to1 = Math.trunc(Number(this.Total));
      to2 = String(Number(this.Total) - Number(to1));
      to2 = Number(to2).toFixed(2)



      for (let i = 0; i < this.items.length; i++) {
        console.log('i==' + i)
        printData += this.items[i].groupname + ' - ';
        printData += this.items[i].itemname + '\n';
        printData += '   ' + this.items[i].price + '\n'
      }

      printData += '************************************\n';

      printData += '\x1B\x61\x02';//right
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
        resolve()
      }, function(err) {
        resolve()
        console.log("Error");
        console.log(err)
      }, printData)
      /////////////////
    })
  };
  /////////////////////////Print////////////////////////////////////

  save(): Promise<void> {
    return new Promise<void>(async resolve => {
      //////////////////
      this.globalvar.no_inv++;
      this.storage.set('no_inv', this.globalvar.no_inv);
      console.log(this.globalvar.no_inv);

      this.sales.code = this.globalvar.no_inv;
      // this.sales.time_stamp = firebase.firestore.FieldValue.serverTimestamp();
      this.sales.unix = firebase.firestore.Timestamp.now().toMillis();
      this.sales.total = this.Total
      this.sales.tax = this.Tax
      this.sales.subtotal = this.Subtotal
      this.sales.username = this.user_login_buy

      await this.db.collection<any>(this.globalvar.company_name + '_sales').add(this.sales);

      this.sales_item.code = this.globalvar.no_inv;
      this.sales_item.unix = firebase.firestore.Timestamp.now().toMillis()

      // this.sales_item.time_stamp = firebase.firestore.FieldValue.serverTimestamp();


      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          db.executeSql('CREATE TABLE IF NOT EXISTS sales_item(id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, qty TEXT, price TEXT, total TEXT, group_name TEXT)', [])
            .then(() => {
              // console.log('Hi M,MMMMMMMMMM Executed SQL')
              db.executeSql('SELECT * FROM sales_item ORDER BY id', [])
                .then(async res => {
                  // console.log('EXECUTED SQL SELECT done');
                  var no = 1;
                  for (var index = 0; index < res.rows.length; index++) {
                    this.sales_item.no = no;
                    this.sales_item.itemname = res.rows.item(index).item_name;
                    this.sales_item.qty = res.rows.item(index).qty;
                    this.sales_item.price = res.rows.item(index).price;
                    this.sales_item.total = res.rows.item(index).total;
                    this.sales_item.groupname = res.rows.item(index).group_name;
                    no++;

                    this.db.collection<any>(this.globalvar.company_name + '_sales_item').add(this.sales_item)

                  }
                }).then(() => {
                  db.executeSql('DELETE FROM sales_item')
                  console.log('Executed SQL deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

                  resolve()

                })
            })
            .catch(e => console.log(e));
        }).catch(e => console.log(e));

      /////////////////
    })
  };
  clear() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM sales_item')

          .then(() => {
            console.log('Executed SQL delete');
            this.create_table();
          })
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e));
    this.create_table();

    this.loading.dismiss();
  }

  async  done() {

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    if (this.globalvar.company_name == '' || this.globalvar.company_name == undefined || this.globalvar.company_name == null) {
      console.log('demooo')

      if (this.globalvar.no_inv == 50) {
        console.log(this.globalvar.no_inv + 'NOOOOOOOOOOOOOOOOOOOOO')
        this.loading.dismiss();
        this.showToast('لقد تجاوزت العدد المسموح به للنسخة التجريبية');

        return false;
      }

    }
    await this.save()
    if (this.globalvar.Printer_name != 'cancel_print') {
      console.log(this.globalvar.Printer_name + '12121212')

      for (var x = 0; x < this.globalvar.number_copies; x++) {
        console.log(this.globalvar.number_copies + '?????')
        // await this.print_text()

        if (x == 0) {
          await this.print_text()
        }
        else if (x >= 1) {
          await this.presentAlert()
          await this.print_text()
          console.log('x==1')
        }

      }
    }


    this.loading.dismiss();
    // https://forum.ionicframework.com/t/is-possible-to-call-a-function-of-another-class/82748/2
    this.events.publish('RefreshPage');
    this.viewCtrl.dismiss();
  }
  doRefresh(refresher: any) {
    console.log('Begin async operation', refresher);
    this.create_table();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);

  }
  edit(item: any) {
    console.log(item)
    var modal = this.modlCtrl.create('EditPage', {
      item: item
    });
    modal.present();

  }

  del(id: any) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM sales_item WHERE id=?', [id])

          .then(() => {
            console.log('Executed SQL delete');
            this.create_table();
          })
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e));

    this.loading.dismiss();
  }

  closeModal() {
    this.events.publish('RefreshPage');
    this.viewCtrl.dismiss();
    //this.navCtrl.push(HomePage)
  }
}

