import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefundPage } from './refund';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    RefundPage,
  ],
  imports: [
    IonicPageModule.forChild(RefundPage),
    NgxDatatableModule
  ],
})
export class RefundPageModule {}
