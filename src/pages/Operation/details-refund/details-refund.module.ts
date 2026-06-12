import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsRefundPage } from './details-refund';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    DetailsRefundPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsRefundPage),
    NgxDatatableModule
  ],
})
export class DetailsRefundPageModule {}
