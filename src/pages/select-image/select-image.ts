import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-select-image',
  templateUrl: 'select-image.html',
})
export class SelectImagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectImagePage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

  img_1(img:string) {
    this.viewCtrl.dismiss(img);
  }

}
