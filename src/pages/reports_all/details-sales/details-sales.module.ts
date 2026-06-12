import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsSalesPage } from './details-sales';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    DetailsSalesPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsSalesPage),
    NgxDatatableModule

  ],
})
export class DetailsSalesPageModule {}
