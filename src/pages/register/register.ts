import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth} from "angularfire2/auth";

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User) {
      try {
          const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
          if(result){
              this.navCtrl.setRoot('HomePage');
              this.toast.create({
                  message: `We hope you like milktea ;)`,
                  duration: 3000
              }).present();
              console.log(result);
              console.log(user);
          }
      }
      catch(e){
          this.toast.create({
              message: e,
              duration: 3000
          }).present();
      }
  }

}
