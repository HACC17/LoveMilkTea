import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MapPage} from "../map/map";

@IonicPage()
@Component({
    selector: 'page-explore',
    templateUrl: 'explore.html',
})

export class ExplorePage {

    currentLocation: any;
    currentLat: any;
    currentLng: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            })
        }
        else {
            console.log("Location blocked");
        }
        console.log(this.currentLocation);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ExplorePage');
    }

    mapTo(value){
        this.navCtrl.push(MapPage, {
            locationIndex: value.toString()
        });
    }

    // will check if app has access to user current location to calculate distance from point of interest
    hasCurrLocation() {
        if(this.currentLocation){
            console.log(this.currentLocation);
            return true;
        }
        else{
            return false;
        }
    }

    findDistance(){

    }
}