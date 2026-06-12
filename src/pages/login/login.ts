import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { GlobalvarProvider } from '../../providers/globalvar/globalvar';
import { User } from './../../services/wash.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  password: string = '';
  var: string = '';
  user$: Observable<User[]>;
  user: User = {
    name: null,
    password: null,
    time_stamp: null
  }
  loading: any;

  user_login_buy: string;

  path_image: string = ''

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController, public storage: Storage,
    public modlCtrl: ModalController, public toastCtrl: ToastController) {

    this.storage.get('company_name').then((val) => {
      this.globalvar.company_name = val;
      console.log(val)
    })



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.var = '';
  }
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });

    toast.present(toast);
  }
  clear() {
    this.password = '';
    this.var = '';
  }
  number(num: any) {
    console.log(num)
    this.password = this.password + num;
  }

  pass() {
    // this.user$ = this.db.collection<User>(this.globalvar.company_name + '_user',
    // ref => ref.where("password", "==", this.password)).valueChanges();
    this.user$ = this.db.collection<User>(this.globalvar.company_name + '_user', ref => ref.where("password", "==", this.password)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          // console.log(data)
          this.user_login_buy = data.name
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );

    this.user$.subscribe(data => {
      // console.log(data.length);
      if (data.length == 0) {
        console.log('No')
        this.showToast("كلمة المرور غير صحيحة");
      }
      else {
        this.globalvar.user_login = this.user_login_buy
        console.log(this.globalvar.user_login)
        console.log('Yes')
        this.navCtrl.setRoot('HomePage')
      }

    })
  }
  ok() {
    console.log('password : ' + this.password)

    if (this.password == '' || this.password == undefined || this.password == null) {
      this.showToast("يرجى كتابة كلمة المرور");
      return false;
    }


    else if (this.password == '000') {

      if (this.globalvar.company_name == '' || this.globalvar.company_name == undefined || this.globalvar.company_name == null) {
        console.log('demooo')

      }

      this.globalvar.user_login = 'Demo'

      console.log(this.globalvar.user_login)
      console.log('Yes')
      this.navCtrl.setRoot('HomePage')


    }



    else {
      this.pass()
    }

  }
}
