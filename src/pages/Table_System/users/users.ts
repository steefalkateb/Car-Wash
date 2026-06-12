import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';

import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';
import { User, WashService } from '../../../services/wash.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';
  user: User = {
    name: null,
    password: null,
    time_stamp: null
  }

  user_edit: User = {
    name: null,
    password: null,
    time_stamp: null
  }
  name: any;
  password: any;

  user$: Observable<User[]>;
  Status_Edit: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    private WashService: WashService, public loadingCtrl: LoadingController,
    public modlCtrl: ModalController, private alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    // this.user$ = this.db.collection<User>(this.globalvar.company_name + '_user').valueChanges();
    this.user$ = this.db.collection<User>(this.globalvar.company_name + '_user', ref => ref.orderBy('time_stamp')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
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

  save(User: any) {
    if (this.name == '' || this.name == null || this.name == undefined) {
      this.showToast('Please Add Name');
      return false;
    }
    if (this.password == '' || this.password == null || this.password == undefined) {
      this.showToast('Please Add Password');
      return false;
    }

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    if (this.Status_Edit == false) {
      this.user.name = this.name;
      this.user.password = this.password;
      this.user.time_stamp = firebase.firestore.FieldValue.serverTimestamp();
      console.log(User);

      this.WashService.Add_User(this.user).then(data => {
        console.log(data.id)
        // this.WashService.Add_User(this.user)
        this.loading.dismiss();
        this.name = '';
        this.password = '';
        this.Status_Edit = false;
      });
      console.log('save');

    }
    else {
      this.user_edit.name = this.name;
      this.user_edit.password = this.password;

      this.WashService.Update_User(this.user_edit, this.user_edit.key).then(() => {
        this.loading.dismiss();
        this.name = '';
        this.password = '';

        this.Status_Edit = false;
      });
      console.log('edit');

    }

  }

  edit(par: User) {
    this.Status_Edit = true;
    this.user_edit = par;
    this.name = this.user_edit.name;
    this.password = this.user_edit.password;

    console.log(this.user_edit)
  }

  delete_user(user: User) {

    if (user.name == 'admin') {
      this.showToast('لا يمكن حذفه');
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'حذف المستخدم',
        message:
          `<p>هل أنت متأكد من حذف المستخدم ؟</p>
        <p>Are you sure you want to delete the user ?</p>`
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
              this.WashService.Delete_User(user.key);
            }
          }
        ]
      });
      alert.present();
    }



   
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
