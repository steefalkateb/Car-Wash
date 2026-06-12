import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalvarProvider {
  public count_cart: number;
  public no_inv: number;


  public company_name: string;
  public company_name_2: string;
  public Printer_name: string;
  public number_copies: number = 1;
  public path_image: string = './assets/imgs/logo.png';
  public print_status: boolean = false;

  public add_tax: boolean;

  public user_login: string;

  public vat_id: string;
  public line_1: string;
  public line_2: string;

  constructor(public http: Http) {
    console.log('Hello GlobalvarProvider Provider');
  }

}
