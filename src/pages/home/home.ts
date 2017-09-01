import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
        if(data && data.email && data.uid){
            this.toast.create({
                message: `We hope you like milktea ;)`,
                duration: 3000
            }).present();
        }
        else{
            this.toast.create({
                message: `Could not find authentication details.`,
                duration: 3000
            }).present();
        }
    });
  }

  logout() {
      this.afAuth.auth.signOut();
      this.navCtrl.push('LoginPage');
  }

}
