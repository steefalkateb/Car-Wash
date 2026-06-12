import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Observable, observable } from 'rxjs';

import { wash_group, WashService } from '../../services/wash.service';
import { map } from 'rxjs/operators';
import { GlobalvarProvider } from '../../providers/globalvar/globalvar';
import { Storage } from '@ionic/storage';

import { AngularFirestore } from 'angularfire2/firestore';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular';

declare let BTPrinter: any;


export interface Item {
  key?: string;
  name: string;
  price: string;
  cost: string;
  groupname: string;
  time_stamp: any;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {


  wash$: Observable<wash_group[]>;
  item$: Observable<Item[]>;

  item: Item = {
    name: null,
    price: null,
    cost: null,
    groupname: null,
    time_stamp: null,
    image: null
  };
  wash: wash_group = {
    name: null,
    time_stamp: null
  }
  cart: number = 0;
  loading: any;
  valve: any;

  tot: number = 0;
  pet: string;
  group_1: string;
  group_2: string;
  group_3: string;
  group_4: string;
  group_5: string;
  group_6: string;
  group_7: string;
  group_8: string;
  group_9: string;
  group_10: string;

  group_status_1: boolean = false;
  group_status_2: boolean = false;
  group_status_3: boolean = false;
  group_status_4: boolean = false;
  group_status_5: boolean = false;
  group_status_6: boolean = false;
  group_status_7: boolean = false;
  group_status_8: boolean = false;
  group_status_9: boolean = false;
  group_status_10: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private WashService: WashService, public storage: Storage,
    public globalvar: GlobalvarProvider, public db: AngularFirestore,
    public modlCtrl: ModalController, private sqlite: SQLite,
    public events: Events, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController, public platform: Platform, public toastCtrl: ToastController) {


    this.pet = '0'
    events.subscribe('RefreshPage', () => {
      this.create_table();
    });



    this.storage.get('company_name').then((val) => {
      this.globalvar.company_name = val;
      console.log(this.globalvar.company_name + ' : ' + '5555555555555555555555555')
      var index: number = 0
      this.wash$ = this.WashService.Get_Group().snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const key = a.payload.doc.id;

            index++
            // console.log(index)
            if (index == 1) {
              this.group_1 = data.name
              this.group_status_1 = true
              this.onClick(this.group_1)
            }
            else if (index == 2) {
              this.group_2 = data.name
              this.group_status_2 = true
            }
            else if (index == 3) {
              this.group_3 = data.name
              this.group_status_3 = true
            }
            else if (index == 4) {
              this.group_4 = data.name
              this.group_status_4 = true
            }
            else if (index == 5) {
              this.group_5 = data.name
              this.group_status_5 = true
            }
            else if (index == 6) {
              this.group_6 = data.name
              this.group_status_6 = true
            }
            else if (index == 7) {
              this.group_7 = data.name
              this.group_status_7 = true
            }
            else if (index == 8) {
              this.group_8 = data.name
              this.group_status_8 = true
            }
            else if (index == 9) {
              this.group_9 = data.name
              this.group_status_9 = true
            }
            else if (index == 10) {
              this.group_10 = data.name
              this.group_status_10 = true
            }

            return { key, ...data };
          });
        })
      );

    });

    this.group_1 = 'text'
    this.group_2 = 'text'
    this.group_3 = 'text'
    this.group_4 = 'text'
    this.group_5 = 'text'
    this.group_6 = 'text'
    this.group_7 = 'text'
    this.group_8 = 'text'
    this.group_9 = 'text'
    this.group_10 = 'text'



    this.storage.get('no_inv').then((val) => {
      this.globalvar.no_inv = val;
    });
    this.create_table();


    // platform.ready().then(() => {
    //   this.print_status()
    // })
    if (platform.is('android')) {
      this.print_status()
    }

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
  print_status() {
    if (this.globalvar.print_status == false) {
      this.presentConfirm()
      this.globalvar.print_status = true;
      console.log('ssssssssssssssssssssssssssssssss')
    }

  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Connect to the printer',
      message: 'هل تريد الاتصال بالطابعة',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.globalvar.Printer_name = 'cancel_print';
            console.log('pppppp666666666555555555' + this.globalvar.Printer_name)

          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.storage.get('Printer_name').then(async (val) => {
              this.globalvar.Printer_name = val;
              console.log('pppppp666666666555555555' + this.globalvar.Printer_name)
              if (val != '' || val != undefined || val != null) {
                await this.connect_to_printer(val)

              }
            })
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  connect_to_printer(pp: any): Promise<void> {
    return new Promise<void>(resolve => {


      //////////////////
      BTPrinter.connect(function(data) {

        console.log('ooooooo' + pp)
        // this.showToast('تم الاتصال بالطابعة' + "  " + pp);

        alert("تم الاتصال بالطابعة" + "  " + pp);

        console.log(data)
        resolve()
      }, function(err) {
        // alert("التطبيق غير متصل بالطابعة");
        alert("التطبيق غير متصل بالطابعة");
        console.log('noooooooooooooooooooooooooooooooooooo' + pp)

        console.log(err)
        resolve()
      }, pp);
      /////////////////
    })
  };






  fill_group() {

  }

  loading_item(wash: any) {
    this.item$ = this.db.collection<Item>(this.globalvar.company_name + '_item',
      ref => ref.where("groupname", "==", wash)).valueChanges();
  }


  async onClick(wash: any) {
    console.log(wash)
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      // duration: 2000,
      dismissOnPageChange: false,
      showBackdrop: true,
      enableBackdropDismiss: true,
      spinner: "bubbles"
    })

    this.loading.present();

    await this.loading_item(wash)

    //////////////////////////////////////////
    // this.storage.get('Printer_name').then(async (val) => {
    //   this.globalvar.Printer_name = val;
    //   console.log('pppppp' + this.globalvar.Printer_name)
    //   if (val != '' || val != undefined || val != null) {


    //     await this.connect_to_printer(val)

    //   }
    // })
    /////////////////////////////////////////


    this.loading.dismiss();

  }


  buy(item: Item) {

    var modalPage = this.modlCtrl.create('BuyPage',
      { keyitem: item });
    modalPage.present();
    console.log(item)
  }

  purchases() {
    // this.wash$ = new Observable<wash_group[]>();
    var modalPage = this.modlCtrl.create('PurchasesPage');
    modalPage.present();
  }

  create_table() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        db.executeSql('CREATE TABLE IF NOT EXISTS sales_item(id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, qty TEXT, price TEXT, total TEXT, group_name TEXT ,imageurl TEXT)', [])
          .then(() => {
            console.log('Hi M,count_cart Executed SQL')
            db.executeSql('SELECT * FROM sales_item ORDER BY id', [])
              .then(res => {
                this.tot = 0
                for (var index = 0; index < res.rows.length; index++) {
                  this.tot = this.tot + Number(res.rows.item(index).price);
                }
                console.log('EXECUTED SQL SELECT done');
                this.cart = res.rows.length;
              })
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
  }

  add(par: Item) {
    console.log(par)
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        ////////ادخال قيم//////
        db.executeSql('INSERT INTO sales_item VALUES(NULL,?,?,?,?,?,?)',
          [par.name, '1', par.price, par.price, par.groupname, par.image])
          .then(() => {
            this.create_table()
            this.loading.dismiss()

          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));

  }
  // mm(ww: string) {
  //   console.log(ww + 'ooooooooo')
  //   if (ww == null || ww == undefined || ww == '') {
  //     console.log('عذراً')
  //   } else {
  //     console.log('hi')

  //   }
  // }

  // openUrl() {
  //   window.open('https://www.youtube.com/watch?v=dIxjcQDW1tM');
  // }

}
