import {Component, ViewChild, ElementRef, Injectable} from '@angular/core';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {isNullOrUndefined} from "util";

declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    panorama: any;
    App: any;
    db: any;
    ref: any;
    marker: any;
    public geoMarkers: any[]; // gonna hold all marker data in here for now.
    loader: any; // holds the module for loading
    infoWindow: any;
    selectedValue: number; //for poplating menu
    locationsList: Array<{ value: number, text: string }> = []; //array to populate menu with
    exploreIndex: any;
    jsonData: any;
    directionsService: any;
    directionsDisplay: any;
    startValue: any; //two values for destination and location
    endValue: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public http: Http) {
        this.exploreIndex = navParams.get('locationIndex');

        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            console.log(firebase);
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");
    }

    ionViewDidLoad() {
        this.loadTags();
        this.loadMap();
    }

    loadMap() {

        this.map = new google.maps.Map(this.mapElement.nativeElement, {

            zoom: 18,
            center: {lat: 21.2969, lng: -157.8171},
            //streetControlView: false;
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            },
            styles: [
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "20"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "10"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "25"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ffbb00"
                        },
                        {
                            "saturation": 43.400000000000006
                        },
                        {
                            "lightness": 37.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00FF6A"
                        },
                        {
                            "saturation": -1.0989010989011234
                        },
                        {
                            "lightness": 11.200000000000017
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FFC200"
                        },
                        {
                            "saturation": -61.8
                        },
                        {
                            "lightness": 45.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#24a95a"
                        },
                        {
                            "lightness": "29"
                        },
                        {
                            "saturation": "-58"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 51.19999999999999
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 52
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "hue": "#00b1ff"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00ffda"
                        },
                        {
                            "saturation": "-50"
                        },
                        {
                            "lightness": "25"
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                }
            ]
        });

        this.panorama = this.map.getStreetView();
        this.panorama.setPosition({lat: 21.298393, lng: -157.818918});

        //set up a default marker.
        this.marker = new google.maps.Marker({
            position: {lat: 21.2969, lng: -157.8171},
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                scale: 4
            }

        });

        this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    //retrieves the tags from our firebase, populates them on map.
    loadTags() {
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")
            .then((dataPoints) => { //ARROW NOTATION IMPORTANT
                //console.log(dataPoints.val())
                dataPoints.forEach((dataPoint) => {
                    this.geoMarkers.push({
                        address: dataPoint.val().address,
                        description: dataPoint.val().description,
                        lat: dataPoint.val().lat,
                        lng: dataPoint.val().lng,
                        name: dataPoint.val().name,
                        number: dataPoint.val().number,
                        website: dataPoint.val().website,
                        type: dataPoint.val().type
                    });
                });
                //console.log(this.geoMarkers);
            })

            .then(() => {

                if (this.exploreIndex) {
                    this.addMarker(this.exploreIndex);
                }

                for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
                    this.locationsList.push({value: i, text: this.geoMarkers[i].name});
                }

                /*
                this.infoWindow = new google.maps.InfoWindow();

                for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                    let data = this.geoMarkers[i],
                        latLng = new google.maps.LatLng(data.lat, data.lng);

                    // Creating a marker and putting it on the map
                //    let marker = new google.maps.Marker({
                //        position: latLng,
                //        map: this.map,
                //    });

                    let info = "Address: " + data.address + " Name: " + data.name;

               //     google.maps.event.addListener(marker, 'click', (() => {
              //          this.infoWindow.setContent(info);
               //         this.infoWindow.open(this.map, marker);
              //      }))
                }
            })
        //console.log(this.geoMarkers);

    }

    addMarker(locationIndex) {
        if (this.marker) {
            this.clearMarker();
        }

        const geoData = this.geoMarkers;
        const imgIndex = parseInt(locationIndex) + 1;

        let imgSrc = "http://manoanow.org/app/map/images/" + imgIndex + ".png";
        let infoContent = '<div class="ui grid"><img class="ui fluid image info" src="' + imgSrc + '">' + '<div id="windowHead">' + geoData[locationIndex].name + '</div>' + '<div id="description">' + geoData[locationIndex].description + '</div>' + '<div id="addressTitle">Address: ' + geoData[locationIndex].address + '</div>' + '<div id="phoneTitle">Phone: ' + geoData[locationIndex].number + '</div>' + '</div>';

        this.marker = new google.maps.Marker({
            position: {lat: geoData[locationIndex].lat, lng: geoData[locationIndex].lng},
            title: 'University of Hawaii at Manoa',
            map: this.map,
        });

        this.infoWindow = new google.maps.InfoWindow({
            content: infoContent,
        });

        this.infoWindow.open(this.map, this.marker);
    }

    clearMarker() {
        this.marker.setMap(null);
    }

    setStartValue(locationIndex) {
        this.startValue = locationIndex;
        this.createRoute();
    }

    setDestValue(locationIndex) {
        this.endValue = locationIndex;
        this.createRoute();
    }

    createRoute() {
        this.clearRoute();

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        if ((!isNullOrUndefined(this.startValue)) && (!isNullOrUndefined(this.endValue))) {
            this.directionsDisplay.setMap(this.map);
            this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, this.startValue, this.endValue);
        }
    }

    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay, sValue, eValue) {
        const geoData = this.geoMarkers;
        let origin = {lat: geoData[sValue].lat, lng: geoData[sValue].lng};
        let destination = {lat: geoData[eValue].lat, lng: geoData[eValue].lng};
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    //Could be useful if needed.
    toggleStreetView() {
        let toggle = this.panorama.getVisible();
        if (toggle == false) {
            this.panorama.setVisible(true);
        } else {
            this.panorama.setVisible(false);
        }
    }

    //Gets data from locations.json file if needed
    getGeoData() {
        this.http.get('assets/data/locations.json')
            .map((res) => res.json())
            .subscribe(data => {
                this.jsonData = data;
            }, (rej) => {
                console.error("Could not load local data", rej)
            });
    }

    filterMarker(category) {
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")
            .then((dataPoints) => { //ARROW NOTATION IMPORTANT
                //console.log(dataPoints.val())
                dataPoints.forEach((dataPoint) => {
                    this.geoMarkers.push({
                        address: dataPoint.val().address,
                        description: dataPoint.val().description,
                        lat: dataPoint.val().lat,
                        lng: dataPoint.val().lng,
                        name: dataPoint.val().name,
                        number: dataPoint.val().number,
                        website: dataPoint.val().website,
                        type: dataPoint.val().type
                    });
                });
                //console.log(this.geoMarkers);
            })

            .then(() => {

                //console.log(this.geoMarkers);
                for (let i = 0; i < this.geoMarkers.length; i++){
                    //      this.geoMarkers[i] = null;
                }

                for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
                    this.locationsList.push({value: i, text: this.geoMarkers[i].name});
                }

                this.infoWindow = new google.maps.InfoWindow();

                for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                    let data = this.geoMarkers[i],
                        latLng = new google.maps.LatLng(data.lat, data.lng);
                    console.log(category);
                    //  if (data.type === 'library') {

                    if (data.type === category) {

                        // Creating a marker and putting it on the map
                        let marker = new google.maps.Marker({
                            position: latLng,
                            map: this.map,
                        });

                        let info = "Address: " + data.address + " Name: " + data.name;

                        google.maps.event.addListener(marker, 'click', (() => {
                            this.infoWindow.setContent(info);
                            this.infoWindow.open(this.map, marker);
                        }))
                    }
                }
            })
        // console.log(this.geoMarkers);

    }

    //Use HTML5 geolocation to get current lat/lng and place marker there
    showCurrLocation() {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        })
        if (navigator.geolocation) {
            this.loader.present().then(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    var latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.marker.setPosition(latLng);
                    this.map.setCenter(latLng);
                    this.loader.dismiss();
                })
            })
        }
    }

}