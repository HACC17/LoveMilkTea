import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component ({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    constructor(public navCtrl: NavController) {

    }

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 18,
            center: {lat: 21.298393, lng: -157.818918}
        });


    }




}

