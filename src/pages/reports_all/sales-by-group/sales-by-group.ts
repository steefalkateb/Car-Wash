import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { wash_group } from '../../../services/wash.service';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';
import { AngularFirestore } from 'angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-sales-by-group',
  templateUrl: 'sales-by-group.html',
})



export class SalesByGroupPage {
  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';
  loading: any;

  wash$: Observable<wash_group[]>;
  sales_item$: Observable<any[]>;

  groupname: any;

  event1 = { startTime: new Date().toISOString(), allDay: false };
  event2 = { endTime: new Date().toISOString(), allDay: false };

  index: number;

  Count_Rows: number = 0;
  total: number = 0;
  total_page: boolean = false;
  total_qty: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.wash$ = this.db.collection<wash_group>(this.globalvar.company_name + '_group', ref => ref.orderBy('time_stamp')).valueChanges();

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event1.startTime = preselectedDate;
    this.event2.endTime = preselectedDate;
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
  view() {
    this.total_page = true
    this.Count_Rows = 0

    this.total= 0;
    this.total_qty= 0;
  
    var date = new Date(this.event1.startTime);
    date.setHours(0, 0, 0, 0);

    var unixtime_startTime = new Date(date).getTime();

    var date_end = new Date(this.event2.endTime);
    date_end.setHours(23, 59, 59, 59);

    var unixtime_endTime = Math.floor(new Date(date_end).getTime());

    // console.log('start ' + unixtime_startTime)
    // console.log('end ' + unixtime_endTime)

    if (this.groupname == null || this.groupname == undefined) {
      this.showToast('يرجى ادخال اسم الجروب');

      return;
    }
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    if (this.groupname == 'Select All') {
      console.log('Select All')

      this.sales_item$ = this.db.collection<any>(this.globalvar.company_name + '_sales_item', ref => ref
        .where('unix', '>=', Number(unixtime_startTime))
        .where('unix', '<=', Number(unixtime_endTime))
      ).valueChanges()
      console.log('11111111111111')
      this.sales_item$.subscribe(data => {
        data.forEach(item => {
          this.total += Number(item.total);
          this.total_qty += Number(item.qty);
          this.Count_Rows += 1
          // console.log(item.total);
        });

      })

    }

    else {
      this.db.collection<any>(this.globalvar.company_name + '_sales_item', ref => ref
        .where('unix', '>=', Number(unixtime_startTime))
        .where('unix', '<=', Number(unixtime_endTime))
      ).valueChanges().subscribe((items) => {
        items.forEach(item => {
          // console.log(item)
          if (item.groupname == this.groupname) {
            console.log(this.groupname)
            this.Count_Rows += 1

            this.total += Number(item.total);
            this.total_qty += Number(item.qty);


            this.sales_item$ = this.db.collection<any>(this.globalvar.company_name + '_sales_item', ref => ref
              .where('groupname', '==', this.groupname)
            ).valueChanges();
            console.log('2222222')
          }
        })
      })

    }
    this.loading.dismiss();

  }
  print(){

  }
  pdf(){
    
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
   // use subscribe and foreach for filtering
        // var val = ev.target.value;
        // this.items.subscribe((_items)=> {
        //     this.filteredItems = [];
        //     _items.forEach(item => {
        //         if( item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
        //             this.filteredItems.push(item);
        //         } 
        //     })
        // });        















      // if (this.groupname == this.groupname) {
      // console.log(unixtime_startTime)
      // console.log(unixtime_endTime)


      // this.sales_item$ = this.db.collection<any>(this.globalvar.company_name + '_sales_item', ref => ref
      //   .where('unix', '>=', Number(unixtime_startTime))
      //   .where('unix', '<=', Number(unixtime_endTime))
      // ).snapshotChanges().pipe(
      //   map(actions => {
      //     actions.filter(item => item.payload.doc.data().group_name === this.groupname)

      //     return actions.map(a => {
      //       const data = a.payload.doc.data();
      //       console.log(data.group_name)
      //       const key = a.payload.doc.id;
      //       return { key, ...data };
      //     });
      //   })
      // );




    // this.sales_item$.pipe(
    //   map(arr =>arr.filter(r => {
    //     r.group_name === this.groupname
    //     // return this.sales_item$;

    //     return this.db.collection<any>(this.globalvar.company_name + '_sales_item');

    //   }))
    //   // .filter(aa => aa.map.name =='lolo')
    //   ).subscribe(x => {
    //     console.log(x)
    //     // return this.sales_item$;
    //   });





    //this.setItems();
    //console.log(this.todos$)



      // return this.sales_item$.forEach(data => {

      //   data.filter(item => item.group_name === this.groupname)
      //   .map(item=>{
      //     console.log(item)
      //   })

      // })

