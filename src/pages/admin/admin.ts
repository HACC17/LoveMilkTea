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
    userInputRef: any;
    masterDataRef: any;
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
        this.userInputRef = this.db.ref('/dataPoints/');
        this.masterDataRef = this.db.ref('/testPoints');
        this.status = "pending";
    }

    ionViewDidLoad() {
        //added this here instead of constructor, better coding practice to put here?
        var items = [];
        this.userInputRef.once('value').then(function(datakey) {
            datakey.forEach(function (data) {
                var temp = data.val();
                Object.assign(temp, {'key': data.key});
                items.push(temp);
            });
        });
        this.items = items;
        console.log(this.items);
    }

    //value is the key for the entry
    approve(value) {
        this.status = "approved";
        console.log(value);
    }

    deny() {
        this.status = "denied";
    }

    //value is the key for the entry
    deleteItem(value){
        this.userInputRef.child(value.key).remove();
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    async logout() {
        const result = await this.afAuth.auth.signOut();
        this.navCtrl.setRoot('HomePage');
    }

}
