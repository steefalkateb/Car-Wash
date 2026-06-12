import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ModalController, reorderArray, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { wash_group, WashService } from '../../../services/wash.service';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';


  editButton: string = 'Edit';
  editing: boolean = false;
  index: number;

  wash: wash_group = {
    name: null,
    time_stamp: null
  }

  wash_edit: wash_group = {
    name: null,
    time_stamp: null
  }

  name: any;
  loading: any;
  wash$: Observable<wash_group[]>;
  item$: Observable<any[]>;

  Status_Edit: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage, public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController, private WashService: WashService,
    public globalvar: GlobalvarProvider, public db: AngularFirestore,
    public modlCtrl: ModalController, public toastCtrl: ToastController, private alertCtrl: AlertController) {
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
    this.wash$ = this.db.collection<wash_group>(this.globalvar.company_name + '_group', ref => ref.orderBy('time_stamp')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );

    // this.wash$.subscribe(result => {
    //   this.aa = [];
    //   result.map(data => {
    //     // console.log(data)
    //     this.aa.push(data)
    //   })
    // });
  }



  save(par1: any) {
    if (par1 == '' || par1 == null || par1 == undefined) {
      this.showToast('Please Add Group Name');
      return false;
    }

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    if (this.Status_Edit == false) {
      console.log(par1);
      this.wash.name = par1;
      this.wash.time_stamp = firebase.firestore.FieldValue.serverTimestamp();

      this.WashService.Add_Group(this.wash).then(() => {

        this.loading.dismiss();
        this.name = '';
        this.Status_Edit = false;
      });
      console.log('save');

    }
    else {
      this.wash_edit.name = this.name;
      this.WashService.Update_Group(this.wash_edit, this.wash_edit.key).then(() => {
        this.loading.dismiss();
        this.name = '';
        this.Status_Edit = false;
      });
      console.log('edit');

    }
  }

  edit(par1: wash_group) {
    this.Status_Edit = true;
    this.wash_edit = par1;
    this.name = this.wash_edit.name;
    console.log(this.wash_edit)
  }

  async delete_group(wash: wash_group) {


    console.log(wash)


    this.item$ = await this.db.collection<any>(this.globalvar.company_name + '_item', ref => ref.where("groupname", "==", wash.name)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );


    this.item$.subscribe(data => {
      console.log(data.length);
      if (data.length == 0) {
        console.log('yessssssssssssssss')
        let alert = this.alertCtrl.create({
          title: 'حذف',
          message:
            `<p>هل أنت متأكد من حذف الجروب ؟</p>
          <p>Are you sure you want to delete the Group ?</p>`
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
                // this.WashService.Delete_Group(wash.key);
              }
            }
          ]
        });
        alert.present();
      }
      else {
        this.showToast('Can not delete the group');
        console.log('nooooooooooooooooooooo')
      }

    })
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
  // toggleEdit(wash: wash_group, id: string) {

  //   this.editing = !this.editing;
  //   if (this.editing) {
  //     this.editButton = 'Done';

  //   } else {
  //     this.editButton = 'Edit';
  //     console.log(this.aa)
  //     var i: number;

  //     for (i = 0; i < this.aa.length; i++) {
  //       this.aa[i].index = i
  //       console.log(this.aa[i].index)

  //       // this.db.collection<any>(this.globalvar.company_name + '_group').doc(id).update(wash)
  //     }
  //     this.db.collection<any>(this.globalvar.company_name + '_group').doc(id).update(wash)

  //   }
  // }
  // reorderData(indexes: any) {

  //   console.log(indexes)
  //   this.aa = reorderArray(this.aa, indexes);
  // }







}//end 
