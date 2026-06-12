import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { GlobalvarProvider } from '../../providers/globalvar/globalvar';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial'
import * as firebase from 'firebase/app';
import { User, WashService } from '../../services/wash.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
declare let BTPrinter: any;



@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {


  user: User = {
    name: null,
    password: null,
    time_stamp: null
  }
  user$: Observable<User[]>;


  Database_name: string;
  company_name_2: string;

  Printer_name: string;
  Number_of_times: number;
  path_image: string = 'assets/imgs/logo.png'
  number_copies: number = 1;

  loading: any;
  add_tax_button_1: boolean;
  vat_id: string;
  line_1: string;
  line_2: string;
  user_login: string;
  file: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globalvar: GlobalvarProvider, public storage: Storage,
    public modlCtrl: ModalController, public loadingCtrl: LoadingController,
    private camera: Camera, private WashService: WashService,
    private alertCtrl: AlertController, private btSerial: BluetoothSerial,
    public events: Events, public db: AngularFirestore) {


    // if (this.path_image == '' || this.path_image == null || this.path_image == undefined) {
    //   this.globalvar.path_image = './assets/imgs/logo.png';
    //   this.path_image = this.globalvar.path_image
    //   console.log(this.path_image + '88888888888888888888888888787878')
    // }

    // if (this.number_copies == 1) {
    //   this.globalvar.number_copies = 1
    //   this.number_copies = this.globalvar.number_copies
    //   console.log(this.number_copies + '11111111111111111111111111111111111111111')
    // }
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

    this.storage.get('Printer_name').then((val) => {
      this.Printer_name = val;
      console.log('Printer_name' + ' : ' + this.Printer_name)
    })


    this.storage.get('Database_name').then(() => {
      this.Database_name = this.globalvar.company_name;
      console.log('Database_name' + ' : ' + this.Database_name)
    })

    this.storage.get('company_name_2').then(() => {
      this.company_name_2 = this.globalvar.company_name_2;
      console.log('Database_name' + ' : ' + this.company_name_2)
    })

    this.storage.get('number_copies').then(() => {
      this.number_copies = this.globalvar.number_copies;
      console.log('number_copies' + ' : ' + this.number_copies)
    })

    this.storage.get('path_image').then(() => {
      this.path_image = this.globalvar.path_image;
      console.log('path_image' + ' : ' + this.path_image)
    })

    this.storage.get('path_image').then(() => {
      this.path_image = this.globalvar.path_image;
      console.log('path_image' + ' : ' + this.path_image)
    })

    this.storage.get('add_tax_button_1').then(() => {
      this.add_tax_button_1 = this.globalvar.add_tax;
      console.log('add_tax_button_1' + ' : ' + this.add_tax_button_1)
    })

    this.storage.get('vat_id').then(() => {
      this.vat_id = this.globalvar.vat_id;
      console.log('vat_id' + ' : ' + this.vat_id)
    })

    this.storage.get('line_1').then(() => {
      this.line_1 = this.globalvar.line_1;
      console.log('line_1' + ' : ' + this.line_1)
    })

    this.storage.get('line_1').then(() => {
      this.line_2 = this.globalvar.line_2;
      console.log('line_2' + ' : ' + this.line_2)
    })


    // this.Database_name = this.globalvar.company_name;
    // this.company_name_2 = this.globalvar.company_name_2;
    // this.Printer_name = this.globalvar.Printer_name;
    // this.number_copies = this.globalvar.number_copies;
    // this.path_image = this.globalvar.path_image;
    // this.add_tax_button_1 = this.globalvar.add_tax;
    // this.vat_id = this.globalvar.vat_id;
    // this.line_1 = this.globalvar.line_1;
    // this.line_2 = this.globalvar.line_2;





  }



  minus() {
    if (this.number_copies == 1) {
      return;
    }
    this.number_copies--;
  }

  plus() {
    if (this.number_copies == 3) {
      return;
    }
    this.number_copies++;
  }

  async select_img(pictureSource: number) {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 300,
        targetWidth: 300,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      }

      const result = await this.camera.getPicture(options)

      this.path_image = `data:image/jpeg;base64,${result}`;
      console.log(this.path_image)

      //   BTPrinter.printBase64(function(data) {
      //     console.log("Success");
      //     console.log(data);
      //   }, function(err) {
      //     console.log("Error");
      //     console.log(err);
      //   }, this.path_image, 1);//base64 string, align
    }
    catch (e) {
      console.error(e);
    }
  }

  save() {
    this.loading = this.loadingCtrl.create({
      // content: 'Please wait...',
      // duration: 2000,
      dismissOnPageChange: false,
      showBackdrop: true,
      enableBackdropDismiss: true,
      spinner: "bubbles"
    })
    this.loading.present();


    this.storage.set('company_name', this.Database_name).then(() => { this.globalvar.company_name = this.Database_name })
    this.storage.set('company_name_2', this.company_name_2).then(() => { this.globalvar.company_name_2 = this.company_name_2 })
    this.storage.set('Printer_name', this.Printer_name).then(() => { this.globalvar.Printer_name = this.Printer_name })
    this.storage.set('number_copies', this.number_copies).then(() => { this.globalvar.number_copies = this.number_copies })
    this.storage.set('image', this.path_image).then(() => { this.globalvar.path_image = this.path_image })
    this.storage.set('vat_id', this.vat_id).then(() => { this.globalvar.vat_id = this.vat_id })
    this.storage.set('line_1', this.line_1).then(() => { this.globalvar.line_1 = this.line_1 })
    this.storage.set('line_2', this.line_2).then(() => { this.globalvar.line_2 = this.line_2 })
    this.storage.set('add_tax_button', this.add_tax_button_1).then(() => { this.globalvar.add_tax = this.add_tax_button_1 })

    this.user$ = this.db.collection<User>(this.globalvar.company_name + '_user').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    );

    this.user$.subscribe(data => {
      console.log(data.length)
      if (data.length == 0) {
        this.user.name = 'admin';
        this.user.password = '000';
        this.user.time_stamp = firebase.firestore.FieldValue.serverTimestamp();

        this.WashService.Add_User(this.user);
      }

    })

    this.loading.dismiss();


  }
  failedAlert(text) {
    let alert = this.alertCtrl.create({
      title: 'Failed',
      subTitle: text,
      buttons: [{
        text: 'OK',
        handler: () => {
          // this.AddData();
        }
      }]

    });
    alert.present();
  }
  select_data() {
    // https://forum.ionicframework.com/t/required-field-with-prompt-alert/47416/8
    let alert = this.alertCtrl.create({
      title: 'ادخل كلمة المرور',
      inputs: [
        {
          name: 'username',
          placeholder: 'Password',
          type: 'number'

        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.username == "0502909433") {

              console.log(data.username)
              ////////////////////////////////////////////////////////////////////////////
              let alert = this.alertCtrl.create({
                title: 'يرجى كتابة اسم قاعدة البيانات',
                inputs: [
                  {
                    name: 'username',
                    placeholder: 'Password'
                  }
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Ok',
                    handler: data => {
                      // console.log(data)
                      console.log(data.username)

                      this.Database_name = data.username
                      console.log(this.Database_name)

                      this.globalvar.company_name = this.Database_name
                      // if (data.user == 'lolo') {
                      //   console.log(data.username)
                      //   this.Database_name = data.username
                      //   // this.Database_name=data.username
                      // }
                    }
                  }
                ]
              });
              alert.present();
              ////////////////////////////////////////////////////////////////////////////
            }
            else if (data.username == "" || data.username != 'lolo') {
              this.failedAlert("username is required"); {
              }
            }
          }
        }
      ]
    });
    alert.present();

  }
  listBTDevice() {
    this.btSerial.list().then(datalist => {

      //1. Open printer select modal
      let abc = this.modlCtrl.create('PrinterListModalPage', { data: datalist });

      //2. Printer selected, save into this.selectedPrinter
      abc.onDidDismiss(data => {
        console.log(data)
        this.Printer_name = data.name;

        let xyz = this.alertCtrl.create({
          title: data.name + " selected",
          buttons: ['OK']
        });
        xyz.present();

      });

      //0. Present Modal
      abc.present();

    }, err => {
      console.log("ERROR", err);
      let mno = this.alertCtrl.create({
        title: "ERROR " + err,
        buttons: ['Dismiss']
      });
      mno.present();
    })

  }

}
