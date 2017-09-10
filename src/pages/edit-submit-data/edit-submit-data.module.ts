import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSubmitDataPage } from './edit-submit-data';

@NgModule({
  declarations: [
    EditSubmitDataPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSubmitDataPage),
  ],
})
export class AdminPageModule {}
