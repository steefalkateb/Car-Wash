import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TotalSalesPage } from './total-sales';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    TotalSalesPage,
  ],
  imports: [
    IonicPageModule.forChild(TotalSalesPage),NgxDatatableModule
  ],
})
export class TotalSalesPageModule {}
