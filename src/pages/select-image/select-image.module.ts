import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectImagePage } from './select-image';

@NgModule({
  declarations: [
    SelectImagePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectImagePage),
  ],
})
export class SelectImagePageModule {}
