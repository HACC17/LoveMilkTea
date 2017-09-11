import {Component, ViewChild, ElementRef, Injectable} from '@angular/core';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {isNullOrUndefined} from "util";

declare var google;
// Array to contain Markers on the map
let stash = [];

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
    selectedValue: number; //for populating menu
    locationsList: Array<{value: number, text: string}> = []; //array to populate menu with
    exploreIndex: any;
    exploreIndex2: any;
    currentLat: any;
    currentLng: any;
    jsonData: any;
    directionsService: any;
    directionsDisplay: any;
    startValue: any; //two values for destination and location
    endValue: any;
    typeList = ["Classroom", "Drink", "Food", "Entertainment", "Housing", "Library", "Parking", "Recreational", "Service"];
    userMarker: any;
    // Should we load location types from a config file?

    // holds icon SVG data and styling.
    icons = {
        food :{
            //spoon and fork
            path:'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8, // you need this defined, there are no defaults.
        },
        drink :{
            //drink glass
            path:'M6 4l4.03 36.47C10.26 42.46 11.95 44 14 44h20c2.05 0 3.74-1.54 3.97-3.53L42 4H6zm18 34c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-10.8S30 28 30 32c0 3.31-2.69 6-6 6zm12.65-22h-25.3l-.88-8h27.07l-.89 8z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        classroom : {
            //school
            path: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        entertainment : {
            //mood
            path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        housing : {
            //home
            path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        library : {
            //book
            path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        parking : {
            //local parking
            path: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        recreational : {
            //local event
            path: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        service : {
            //business center
            path: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z',
            fillColor: 'lightgreen',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },

        };

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public http: Http) {
        this.exploreIndex = navParams.get('locationIndex');
        this.exploreIndex2 = navParams.get('locationIndex2');
        this.currentLat = navParams.get('currentLat');
        this.currentLng = navParams.get('currentLng');

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


    //retrieves the tags from our firebase, populates them on map.
    loadTags() {
        this.cleanAllMarkers();
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        console.log(this.icons);
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

                if (this.exploreIndex && this.currentLat && this.currentLng) {
                    this.createExpRoute();
                }
                else if (!this.exploreIndex && this.exploreIndex2) {
                 this.addMarker(this.exploreIndex2);
                 }


                for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
                    this.locationsList.push({value: i, text: this.geoMarkers[i].name});
                }


                this.infoWindow = new google.maps.InfoWindow();

                for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                    let data = this.geoMarkers[i],
                        latLng = new google.maps.LatLng(data.lat, data.lng);
                       // type = this.geoMarkers[i].type;

                    // Creating a marker and putting it on the map
                    let marker = new google.maps.Marker({
                        position: latLng,
                        map: this.map,
                        icon: this.icons[data.type],
                    });

                   // marker.setIcon(this.icons[data.type]);

                    stash.push(marker);

                    let info = "Address: " + data.address + " Name: " + data.name;

                    google.maps.event.addListener(marker, 'click', (() => {
                        this.infoWindow.setContent(info);
                        this.infoWindow.open(this.map, marker);
                    }))
                }
            })
    }

    addMarker(locationIndex) {
        if (this.marker) {
            this.clearStarterMarker();
        }

        const geoData = this.geoMarkers;
        const imgIndex = parseInt(locationIndex) + 1;

        let imgSrc = "http://manoanow.org/app/map/images/" + imgIndex + ".png";
        let infoContent = '<div class="ui grid"><img class="ui fluid image info" src="' + imgSrc + '">' + '<div id="windowHead">' + geoData[locationIndex].name + '</div>' + '<div id="description">' + geoData[locationIndex].description + '</div>' + '<div id="addressTitle">Address: ' + geoData[locationIndex].address + '</div>' + '<div id="phoneTitle">Phone: ' + geoData[locationIndex].number + '</div>' + '</div>';

        this.marker = new google.maps.Marker({
            position: {lat: geoData[locationIndex].lat, lng: geoData[locationIndex].lng},
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[geoData[locationIndex].type],
        });



        this.infoWindow = new google.maps.InfoWindow({
            content: infoContent,
        });

        this.infoWindow.open(this.map, this.marker);
    }

    clearStarterMarker() {
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

    // For explore page routing
    createExpRoute() {
        if (this.marker) {
            this.clearStarterMarker();
        }
        this.clearRoute();

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        this.directionsDisplay.setMap(this.map);
        this.calculateAndDisplayExpRoute(this.directionsService, this.directionsDisplay);
    }

    // For explore page routing
    calculateAndDisplayExpRoute(directionsService, directionsDisplay) {
        const geoData = this.geoMarkers;
        let origin = {lat: this.currentLat, lng: this.currentLng};
        let destination = {lat: geoData[this.exploreIndex].lat, lng: geoData[this.exploreIndex].lng};
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
        let criteria = category.charAt(0).toLowerCase() + category.slice(1);
        console.log(criteria);
        // For "dual-layered" filtering clean out the "cleanAllMarkers call"
        this.cleanAllMarkers();
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];


        this.ref.once("value")
            .then((dataPoints) => {
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
            })

            .then(() => {


                for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
                    this.locationsList.push({value: i, text: this.geoMarkers[i].name});
                }

                this.infoWindow = new google.maps.InfoWindow();

                for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                    let data = this.geoMarkers[i],
                        latLng = new google.maps.LatLng(data.lat, data.lng);

                    if (data.type === criteria) {

                        // Creating a marker and putting it on the map
                        let marker = new google.maps.Marker({
                            position: latLng,
                            map: this.map,
                            icon: this.icons[data.type],

                        });

                        // Push into a Markers array
                        stash.push(marker);

                        let info = "Address: " + data.address + " Name: " + data.name;

                        google.maps.event.addListener(marker, 'click', (() => {
                            this.infoWindow.setContent(info);
                            this.infoWindow.open(this.map, marker);
                        }))
                    } else {
                        console.log("Category: " + criteria + " does not exist!");
                    }
                }
            })
    }

    cleanAllMarkers() {
        if (stash) {
            for (let i = 0; i < stash.length; i++) {
                stash[i].setMap(null);
            }
            stash.length = 0;
        } else {
            console.log('Stash array does not exist!');
        }
    }

    //Use HTML5 geolocation to get current lat/lng and place marker there
    showCurrLocation() {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        })
        if (navigator.geolocation) {
            this.loader.present().then(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLat = position.coords.latitude;
                    this.currentLng = position.coords.longitude;
                    var latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.userMarker.setPosition(latLng);
                    this.map.setCenter(latLng);
                    this.loader.dismiss();
                })
            })
        }
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
        this.userMarker = new google.maps.Marker({
            position: {lat: 21.2969, lng: -157.8171},
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: {
                //directions walk
                path:'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8, // you need this defined, there are no defaults.
                scale: 1.75
            }

        });
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
}