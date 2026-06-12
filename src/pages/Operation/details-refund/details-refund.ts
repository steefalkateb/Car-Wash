import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';
import { map } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-details-refund',
  templateUrl: 'details-refund.html',
})
export class DetailsRefundPage {

  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';

  event1 = { startTime: new Date().toISOString(), allDay: false };
  event2 = { endTime: new Date().toISOString(), allDay: false };

  refund = new Array()
  loading: any;

  ref$: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController) {


    // let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    // this.event1.startTime = preselectedDate;
    // this.event2.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsRefundPage');
  }
  view() {
    console.log(this.event1.startTime)
    console.log(this.event2.endTime)

    var date = new Date(this.event1.startTime);
    date.setHours(0, 0, 0, 0);

    // var unixtime_startTime = new Date(date).getTime() / 1000;
    var unixtime_startTime = new Date(date).getTime();

    var date_end = new Date(this.event2.endTime);
    date_end.setHours(23, 59, 59, 59);


    // var unixtime_endTime = Math.floor(new Date(date_end).getTime() / 1000);
    var unixtime_endTime = Math.floor(new Date(date_end).getTime());

    // console.log(date)
    // console.log(date_end)

    console.log(unixtime_startTime)
    console.log(unixtime_endTime)

    this.ref$ = this.db.collection<any>(this.globalvar.company_name + '_refund',
    ref => ref.where('unix', '>=', Number(unixtime_startTime))
      .where('unix', '<=', Number(unixtime_endTime))).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          console.log(data)
          const key = a.payload.doc.id;
          return { key, ...data };
        });
      })
    )
    this.db.collection<any>(this.globalvar.company_name + '_refund', ref => ref.where('unix', '>=', Number(unixtime_startTime))
      .where('unix', '<=', Number(unixtime_endTime))).valueChanges();

    this.ref$ = this.db.collection<any>(this.globalvar.company_name + '_refund', ref => ref
      .where('unix', '>=', Number(this.refund[0].start))
      .where('unix', '<=', Number(this.refund[this.refund.length - 1].end)))
      .valueChanges();

    // this.mm()
  }


  // mm() {
  //   this.ref$.subscribe(result => {

  //     result.map(data => {
  //       console.log(data)
  //     })

  //   });
  // }
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
