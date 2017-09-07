import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-admin',
    templateUrl: 'admin.html',
})
export class AdminPage {
    ref: any;
    childRef: any;
    App: any;
    db: any;
    items: string[];
    status: string;


    constructor(private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase;
        }
        this.db = this.App.database();
        this.ref = this.db.ref('/dataPoints/');
        var items = [];
        this.ref.once('value').then(function(datakey) {
            datakey.forEach(function (data) {
                var temp = data.val();
                Object.assign(temp, {'key': data.key});
                items.push(temp);
            });
        });
        this.items = items;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AdminPage');
    }

    displayData() {
        var items = [];
        this.ref.once('value').then(function(datakey) {
            datakey.forEach(function (data) {
                var temp = data.val();
                Object.assign(temp, {'key': data.key});
                items.push(temp);
            });
        });
        this.items = items;
    }
    approve() {

    }

    deleteItem(value){
        this.ref.child(value.key).remove();
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    async logout() {
        const result = await this.afAuth.auth.signOut();
        this.navCtrl.setRoot('HomePage');
    }

}
