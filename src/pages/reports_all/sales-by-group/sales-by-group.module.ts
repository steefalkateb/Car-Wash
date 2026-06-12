import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesByGroupPage } from './sales-by-group';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    SalesByGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesByGroupPage),
    NgxDatatableModule
  ],
})
export class SalesByGroupPageModule {}
