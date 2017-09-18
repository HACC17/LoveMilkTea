import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointsPage } from './points';

@NgModule({
  declarations: [
      PointsPage,
  ],
  imports: [
    IonicPageModule.forChild(PointsPage),
  ],
})
export class PointsPageModule {}
