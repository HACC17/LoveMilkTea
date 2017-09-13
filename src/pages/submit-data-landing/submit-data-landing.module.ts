import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitDataLandingPage } from './submit-data-landing';

@NgModule({
  declarations: [
      SubmitDataLandingPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmitDataLandingPage),
  ],
})
export class SubmitDataLandingPageModule {}
