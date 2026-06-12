import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { wash_group, Item, WashService } from '../../../services/wash.service';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';

import * as firebase from 'firebase/app';
// import { PurchasesPage } from '../purchases/purchases';

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {


  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json


  tablestyle = 'bootstrap';


  item: Item = {
    name: null,
    price: null,
    cost: null,
    groupname: null,
    time_stamp: null,
    image: null

  };


  sales$: Observable<any[]>;
  wash$: Observable<wash_group[]>;
  item$: Observable<Item[]>;
  loading: any;



  name: any;
  price: any;
  cost: any;
  groupname: any;

  Status_Edit: boolean = false;

  item_edit: Item = {
    name: null,
    price: null,
    cost: null,
    groupname: null,
    time_stamp: null,
    image: null
  }
  path_image: string = "assets/imgs/logo_item_page.png"

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController, private WashService: WashService,
    public modlCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController, private alertCtrl: AlertController) {

    this.wash$ = this.db.collection<wash_group>(this.globalvar.company_name + '_group', ref => ref.orderBy('time_stamp')).valueChanges();


    //   let date11 = new Date()
    //   console.log(date11)

    //   //this.item$ = this.db.collection<Item>(this.globalvar.company_name + '_item', ref => ref.orderBy('time_stamp').where('time_stamp','==','1550657141')).snapshotChanges().pipe(

    //   this.item$ = this.db.collection<Item>(this.globalvar.company_name + '_item', ref => ref.where('time_stamp', '==', date11)).snapshotChanges().pipe(
    //     map(actions => {
    //       return actions.map(a => {
    //         const data = a.payload.doc.data();
    //         const key = a.payload.doc.id;
    //         return { key, ...data };
    //       });
    //     })
    //   );

    // }




    this.item$ = this.db.collection<Item>(this.globalvar.company_name + '_item', ref => ref.orderBy('time_stamp')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );

  }

  select_img() {
    const modal = this.modlCtrl.create('SelectImagePage');
    modal.onDidDismiss(data => {
      if (data == undefined || data == null || data == '') {
        this.path_image = "assets/imgs/logo_item_page.png"
      }
      else {
        this.path_image = data
        console.log(data)
      }
    })
    modal.present();
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
  }

  save(Item: any) {
    if (this.name == '' || this.name == null || this.name == undefined) {
      this.showToast('Please Add Name');
      return false;
    }
    if (this.price == '' || this.price == null || this.price == undefined) {
      this.showToast('Please Add Price');
      return false;
    }

    if (this.cost == '' || this.cost == null || this.cost == undefined) {
      this.showToast('Please Add Cost');
      return false;
    }
    if (this.groupname == '' || this.groupname == null || this.groupname == undefined) {
      this.showToast('Please Add Group Name');
      return false;
    }
    if (this.path_image == "assets/imgs/logo_item_page.png") {
      this.showToast('Please Add Image');
      return false;
    }

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    if (this.Status_Edit == false) {
      console.log(Item);
      this.item.name = this.name;
      this.item.price = this.price;
      this.item.cost = this.cost;
      this.item.groupname = this.groupname;
      this.item.image = this.path_image;
      // this.item.time_stamp = firebase.firestore.FieldValue.serverTimestamp();
      ////////////////////////////////////////////////////////////////////////////////
      this.item.time_stamp = firebase.firestore.Timestamp.now().toMillis();
      ////////////////////////////////////////////////////////////////////////////////
      this.WashService.Add_Item(this.item).then(() => {
        this.loading.dismiss();
        this.name = '';
        this.price = '';
        this.cost = '';
        this.groupname = '';
        this.path_image = "assets/imgs/logo_item_page.png";

        this.Status_Edit = false;
      });
      console.log('save');

    }
    else {
      this.item_edit.name = this.name;
      this.item_edit.price = this.price;
      this.item_edit.cost = this.cost;
      this.item_edit.groupname = this.groupname;
      this.item_edit.image = this.path_image;

      this.WashService.Update_Item(this.item_edit, this.item_edit.key).then(() => {
        this.loading.dismiss();
        this.name = '';
        this.price = '';
        this.cost = '';
        this.groupname = '';
        this.path_image = "assets/imgs/logo_item_page.png";

        this.Status_Edit = false;
      });
      console.log('edit');

    }
  }



  edit(par: Item) {
    this.Status_Edit = true;
    this.item_edit = par;
    this.name = this.item_edit.name;
    this.price = this.item_edit.price;
    this.cost = this.item_edit.cost;
    this.groupname = this.item_edit.groupname;
    this.path_image = this.item_edit.image;

    console.log(this.item_edit)
  }

  delete_group(item: Item) {
    console.log(item)
     let alert = this.alertCtrl.create({
      title: 'حذف المحتوى',
      message:
        `<p>هل أنت متأكد من الحذف  ؟</p>
      <p>Are you sure you want to delete ?</p>`
      ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'delete',
          handler: () => {
            console.log('delete clicked');
            this.WashService.Delete_Item(item.key);
          }
        }
      ]
    });
    alert.present();

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
