import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { GlobalvarProvider } from './../providers/globalvar/globalvar';


export interface wash_group {
  key?: string;
  name: string;
  // imgurl: string;
  time_stamp: any;
}

export interface Item {
  key?: string;
  name: string;
  price: number;
  cost: string;
  groupname: string;
  time_stamp: any;
  image: string;
}

export interface User {
  key?: string;
  name: string;
  password: string;
  time_stamp: any;
}



@Injectable()
export class WashService {

  private Group_Collection: AngularFirestoreCollection<wash_group>;

  private Item_Collection: AngularFirestoreCollection<Item>;

  private User_Collection: AngularFirestoreCollection<User>;




  constructor(public db: AngularFirestore, public globalvar: GlobalvarProvider) {
  }

  Get_Group() {
    this.Group_Collection = this.db.collection<wash_group>(this.globalvar.company_name + '_group', ref => ref.orderBy('time_stamp'));
    return this.Group_Collection;
  }

  Add_Group(wash: wash_group) {
    this.Group_Collection = this.db.collection<wash_group>(this.globalvar.company_name + '_group');
    return this.Group_Collection.add(wash);
  }

  Update_Group(wash: wash_group, id: string) {
    this.Group_Collection = this.db.collection<wash_group>(this.globalvar.company_name + '_group');
    return this.Group_Collection.doc(id).update(wash);
  }

  Delete_Group(id: string) {
    this.Group_Collection = this.db.collection<wash_group>(this.globalvar.company_name + '_group');
    return this.Group_Collection.doc(id).delete();
  }

  ///////////////////////////////////////////////////////////////////////////

  Get_Item() {
    this.Item_Collection = this.db.collection<Item>(this.globalvar.company_name + '_item');
    return this.Item_Collection;
  }

  Add_Item(item: Item) {
    this.Item_Collection = this.db.collection<Item>(this.globalvar.company_name + '_item');
    return this.Item_Collection.add(item);
  }

  Update_Item(item: Item, id: string) {
    this.Item_Collection = this.db.collection<Item>(this.globalvar.company_name + '_item');
    return this.Item_Collection.doc(id).update(item);
  }

  Delete_Item(id: string) {
    this.Item_Collection = this.db.collection<Item>(this.globalvar.company_name + '_item');
    return this.Item_Collection.doc(id).delete();
  }

  ///////////////////////////////////////////////////////////////////////////

  Get_User() {
    this.User_Collection = this.db.collection<User>(this.globalvar.company_name + '_user');
    return this.User_Collection;
  }

  Add_User(user: User) {
    this.User_Collection = this.db.collection<User>(this.globalvar.company_name + '_user');
    return this.User_Collection.add(user);
  }

  Update_User(user: User, id: string) {
    this.User_Collection = this.db.collection<User>(this.globalvar.company_name + '_user');
    return this.User_Collection.doc(id).update(user);
  }

  Delete_User(id: string) {
    this.User_Collection = this.db.collection<User>(this.globalvar.company_name + '_user');
    return this.User_Collection.doc(id).delete();
  }

  ///////////////////////////////////////////////////////////////////////////

}
