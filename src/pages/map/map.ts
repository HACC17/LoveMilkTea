import {Component, ViewChild, ElementRef, Injectable} from '@angular/core';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {IonicPage, NavController, NavParams, LoadingController, Select} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {isNullOrUndefined} from "util";
import * as Fuse from 'fuse.js';
import {Geolocation} from '@ionic-native/geolocation';

declare var google;
// Array to contain Markers on the map
let stash = [];

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',

})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('filterSelect') filterSelect: Select;
    map: any;
    panorama: any;
    App: any;
    db: any;
    ref: any;
    marker: any;
    public geoMarkers: any[]; // Holds all the marker data
    loader: any; // Holds the module for loading
    infoWindow: any;
    streetTag: any;
    locationsList: any = []; //array to populate menu with\
    searchList: any[]; //array that will be used for searching. Eventually make this function like locationsList?
    exploreIndex: any;
    exploreIndex2: any;
    currentLat: any;
    currentLng: any;
    latLng: any;
    jsonData: any;
    directionsService: any;
    directionsDisplay: any;
    location: any;
    startValue: any; // Values for destination and location
    endValue: any;
    typeList = ["Classroom", "Drink", "Food", "Entertainment", "Housing", "Library", "Parking", "Recreational", "Service"];
    userMarker: any;
    changeIcon: boolean = false;
    isSearching: boolean = false;
    isInfoWindowOpen: boolean = false;
    searchingStart: boolean = false;
    inRoute: boolean = false;
    navId: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public http: Http, private geolocation: Geolocation) {
        this.exploreIndex = navParams.get('locationIndex');
        this.exploreIndex2 = navParams.get('locationIndex2');
        this.currentLat = navParams.get('currentLat');
        this.currentLng = navParams.get('currentLng');


        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });


        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");
    }

    ionViewDidLoad() {
        this.loadTagData(); //we'll just load all data from firebase once
        this.loadMap();
        this.getLatLng();
    }

    searchPoints(input) {
        this.isSearching = true;
        let fuse = new Fuse(this.searchList, this.fuseOptions)

        if (input === '') {
            this.searchList = this.geoMarkers;
        } else {
            this.searchList = fuse.search(input);
        }
    }

    stopSearch() {
        this.isSearching = false;
    }

    showSearch() {
        this.isSearching = true;
    }

    // Load up locationsList for populating selector menus. Called in loadTags();
    loadLocationsList() {
        for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
            this.locationsList.push({
                value: i,
                text: this.geoMarkers[i].name
            });
        }
    }

    // Retrieves the tags from Firebase and populates them on map.
    loadTagData() {
        // Load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")

            .then((dataPoints) => {

                dataPoints.forEach((dataPoint) => {
                    this.geoMarkers.push({
                        key: dataPoint.key,
                        address: dataPoint.val().address,
                        description: dataPoint.val().description,
                        lat: dataPoint.val().lat,
                        lng: dataPoint.val().lng,
                        name: dataPoint.val().name,
                        number: dataPoint.val().number,
                        website: dataPoint.val().website,
                        type: dataPoint.val().type,
                    });
                });
            })
            .then(() => {

                if (this.exploreIndex && this.currentLat && this.currentLng) {
                    this.createExpRoute();
                }
                else if (!this.exploreIndex && this.exploreIndex2) {
                    this.addExpMarker(this.exploreIndex2);
                }

                this.searchList = this.geoMarkers.slice();

                this.loadLocationsList();
            })
    }


    // Pass in the entire object now that key field holds image index
    addMarker(location) {
        if (this.marker) {
            this.clearStarterMarker();
        }

        this.stopSearch();

        const geoData = this.geoMarkers.slice();
        const imgIndex = location.key;

        this.endValue = {
            lat: location.lat, lng: location.lng
        };

        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[location.type],
        });

        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
        });
        google.maps.event.addListener(this.infoWindow, 'domready', (() => {
            document.getElementById("infoIcon").addEventListener("click", () => {
                this.navCtrl.push("PointsPage", location);
            });
        }));
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;

        this.streetTag = new google.maps.InfoWindow({
            content: '<div class="street-tag">' + location.name + '</div>',
        });

        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
            this.clearStarterMarker();
        }));
    }

    addExpMarker(index) {
        if (this.marker) {
            this.clearStarterMarker();
        }

        const geoData = this.geoMarkers.slice();
        const location = geoData[index];

        this.endValue = {lat: location.lat, lng: location.lng};

        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[location.type],
        });

        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
        });
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;

        this.streetTag = new google.maps.InfoWindow({
            content: '<div class="street-tag">' + location.name + '</div>',
        });

        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
            this.clearStarterMarker();
        }));
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

    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }

    createRoute() {
        this.clearRoute();

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;

        if ((!isNullOrUndefined(this.startValue)) && (!isNullOrUndefined(this.endValue))) {
            this.directionsDisplay.setMap(this.map);
            this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, this.startValue, this.endValue);
            if (this.changeIcon === true) {
                this.changeAllMarkers();
            }
        }
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay, sValue, eValue) {
        const geoData = this.geoMarkers.slice();
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
        /*if (this.marker) {
         this.clearStarterMarker();
         }*/
        this.clearRoute();
        this.inRoute = true;
        this.isInfoWindowOpen = true;

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

        this.addMarker(geoData[this.exploreIndex]);

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

    searchStart() {
        if (!this.inRoute) {
            if (this.marker) {
                this.clearStarterMarker();
            }
            this.clearAllMarkers();
            this.inRoute = true;
            this.searchingStart = true;
        }
        else {
            this.clearRoute();
            if (this.infoWindow) {
                this.infoWindow.close();
                this.clearStarterMarker();
            }
            this.isInfoWindowOpen = false;
            this.inRoute = false;
            this.searchingStart = false;
            this.stopTrack();
            this.showCurrLocation();
        }
    }

    searchStop() {
        this.isInfoWindowOpen = false;
        this.inRoute = false;
        this.searchingStart = false;
        this.showCurrLocation();
    }

    directFromCurrentLocation() {
        this.searchingStart = false;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        let origin = this.latLng;
        let destination = this.endValue;
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        this.trackLocation();

    }

    directFromLocation(location) {
        this.searchingStart = false;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);

        let origin = this.latLng;
        let destination = this.endValue;
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    // Could be useful if needed.
    toggleStreetView() {
        this.panorama.setPosition(this.endValue);
        if (!this.inStreetView()) {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.marker.setMap(this.panorama);
                this.infoWindow.close();
                this.streetTag.open(this.panorama, this.marker);
            }
            this.panorama.setVisible(true);
        } else {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.streetTag.close();
                this.infoWindow.open(this.map, this.marker);
                this.marker.setMap(this.map);
            }
            this.panorama.setVisible(false);
        }
    }

    inStreetView() {
        if (this.panorama) {
            if (this.panorama.getVisible()) {
                return true;
            }
            else {
                return false;
            }
        }
    }


    // Gets data from locations.json file if needed
    getGeoData() {
        this.http.get('assets/data/locations.json')
            .map((res) => res.json())
            .subscribe(data => {
                this.jsonData = data;
            }, (rej) => {
                console.error("Could not load local data", rej)
            });
    }

    doFilter() {
        this.filterSelect.open();
    }

    filterMarker(category) {
        let criteria = category.charAt(0).toLowerCase() + category.slice(1);
        // For "dual-layered" filtering clean out the "changeAllMarkers call"
        this.clearAllMarkers();
        this.changeIcon = true;

        this.infoWindow = new google.maps.InfoWindow();

        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i],
                latLng = new google.maps.LatLng(data.lat, data.lng);

            if (data.type === criteria) {

                // Creating a marker and putting it on the map
                this.marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: this.icons[data.type],
                });

                // Push into a Markers array
                stash.push(this.marker);

                let info = this.getInfoWindowData(data);

                google.maps.event.addListener(this.marker, 'click', (() => {
                    this.infoWindow.setContent(info);
                    this.isInfoWindowOpen = true;
                    this.marker.setPosition({lat: data.lat, lng: data.lng});
                    this.infoWindow.open(this.map, this.marker);
                    document.getElementById("infoIcon").addEventListener("click", () => {
                        this.navCtrl.push("PointsPage", data);
                    });
                    this.endValue = latLng;
                    this.streetTag = new google.maps.InfoWindow({
                        content: '<div class="street-tag">' + data.name + '</div>',
                    });
                }));

                google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                    this.isInfoWindowOpen = false;
                }));
            } else {
                console.log("Category: " + criteria + " does not exist!");
            }
        }

        this.map.setCenter({lat: 21.2969, lng: -157.8171});
        this.map.setZoom(15);

    }

    changeAllMarkers() {
        if (this.changeIcon === true) {
            if (stash.length !== 0) {
                for (let i = 0; i < stash.length; i++) {
                    stash[i].setMap(null);
                }
                stash.length = 0;
                this.changeIcon = false;
            } else {
                console.log('Stash array does not exist!');
            }
        } else if (this.changeIcon === false) {
            this.changeIcon = true;
            this.placeAllMarkers();
        }
    }

    clearAllMarkers() {
        if (stash) {
            for (let i = 0; i < stash.length; i++) {
                stash[i].setMap(null);
            }
            stash.length = 0;
            this.changeIcon = false;
        } else {
            console.log('Stash array does not exist!');
        }
    }

    getInfoWindowData(location) {

        let infoContent = '<div class="ui grid">';
        if (location.key) {
            let imgSrc = "http://manoanow.org/app/map/images/" + location.key + ".png";
            infoContent += '<img class="ui fluid image info" src="' + imgSrc + '">'
        }
        if (location.name) {
            infoContent += '<div id="windowHead">' + location.name + '</div>'
        }
        if (location.description) {
            infoContent += '<div id="description">' + location.description + '</div>'
        }
        if (location.address) {
            infoContent += '<div id="addressTitle">Address: ' + location.address + '</div>'
        }
        if (location.number) {
            infoContent += '<div id="phoneTitle">Phone: ' + location.number + '</div>';
        }
        infoContent += '<i id="infoIcon">' + '&#9432;' + '</i>';
        infoContent += '</div>';

        return infoContent;
    }

    placeAllMarkers() {

        this.clearAllMarkers();
        this.infoWindow = new google.maps.InfoWindow();

        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i],
                latLng = new google.maps.LatLng(data.lat, data.lng);

            // Creating a marker and putting it on the map
            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                icon: this.icons[data.type],
            });

            stash.push(this.marker);
            let info = this.getInfoWindowData(data);

            google.maps.event.addListener(this.marker, 'click', (() => {
                this.infoWindow.setContent(info);
                this.isInfoWindowOpen = true;
                this.marker.setPosition({lat: data.lat, lng: data.lng});
                this.marker.setIcon(this.icons[data.type]);
                this.infoWindow.open(this.map, this.marker);
                document.getElementById("infoIcon").addEventListener("click", () => {
                    this.navCtrl.push("PointsPage", data);
                });
                this.endValue = latLng;
                this.streetTag = new google.maps.InfoWindow({
                    content: '<div class="street-tag">' + data.name + '</div>',
                });
            }))

            google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                this.isInfoWindowOpen = false;
            }));

            this.changeIcon = true;
            this.map.setCenter({lat: 21.2969, lng: -157.8171});
            this.map.setZoom(15);
        }
    }


    getLatLng() {


        if (this.currentLat && this.currentLng && !this.latLng) {
            this.latLng = {
                lat: this.currentLat,
                lng: this.currentLng
            };
        }
        else if (!this.latLng) {
            this.loader = this.loading.create({
                content: "Getting Coordinates..."
            })
            if (navigator.geolocation) {
                this.loader.present().then(() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.currentLat = position.coords.latitude;
                        this.currentLng = position.coords.longitude;
                        this.latLng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.loader.dismiss();
                    });
                });
            }
        }
    }


    // Use HTML5 geolocation to get current lat/lng and place marker there
    showCurrLocation() {
        if (this.latLng) {
            this.userMarker.setMap(this.map);
            this.map.setCenter(this.latLng);
            this.userMarker.setPosition(this.latLng);
            this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
            this.map.setZoom(17);
        }
    }

    // Use HTML5 Geolocation to track lat/lng
    trackLocation() {
        this.navId = navigator.geolocation.watchPosition((position) => {

                var newPoint = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);


                if (this.userMarker) {

                    this.userMarker.setPosition(newPoint);
                    this.userMarker.setMap(this.map);
                    this.map.setZoom(17);
                    this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
                }

                this.map.setZoom(17);
                this.map.setCenter(newPoint);

            },
            (error) => {
                console.log(error);
            }, {
                timeout: 5000
            });

        //setTimeout(this.trackLocation(), 10000);
    }

    stopTrack() {
        navigator.geolocation.clearWatch(this.navId);
        this.userMarker.setMap(null);
    }

    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 15,
            zoomControl: false,
            center: {
                lat: 21.2969, lng: -157.8171
            },
            mapTypeControlOptions: {
                mapTypeIds: ['styled_map']
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
                // Remove the next five if we want labels back
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
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

        this.panorama = new google.maps.StreetViewPanorama(
            document.getElementById('map'), {
                addressControl: false,
                panControl: false,
                enableCloseButton: false,
                zoomControl: false
            });
        this.panorama.setVisible(false);
        this.map.setStreetView(this.panorama);

// Set up a default marker.
        this.userMarker = new google.maps.Marker({
            position: {
                lat: 21.2969, lng: -157.8171
            },
            title: 'University of Hawaii at Manoa',
            icon: {
                // Walking Directions
                path: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
                fillColor: '#1B9A74',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8, // you need this defined, there are no defaults.
                scale: 1.75
            }

        });
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
    }

// Set up search params for the fuzzy search
    fuseOptions: Fuse.FuseOptions = {
        caseSensitive: false,
        keys: ['address', 'description', 'name', 'type'],
        threshold: 0.5,
        shouldSort: true,
    };

// Holds icon SVG data and styling.
    icons = {
        food: {
            // Spoon and fork icon
            path: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
            fillColor: '#FF6699',
            strokeColor: '#CA3157',
            fillOpacity: 0.8, // you need this defined, there are no defaults.
        },
        drink: {
            // Drink glass icon
            path: 'M6 4l4.03 36.47C10.26 42.46 11.95 44 14 44h20c2.05 0 3.74-1.54 3.97-3.53L42 4H6zm18 34c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-10.8S30 28 30 32c0 3.31-2.69 6-6 6zm12.65-22h-25.3l-.88-8h27.07l-.89 8z',
            fillColor: '#FF6699',
            strokeColor: '#CA3157',
            fillOpacity: 0.8,
        },
        classroom: {
            // School icon
            path: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
            fillColor: '#007c34',
            strokeColor: 'darkgreen',
            fillOpacity: 0.8,
        },
        entertainment: {
            // Mood icon
            path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
            fillColor: '#4E2683',
            strokeColor: '#4E2683',
            fillOpacity: 0.8,
        },
        housing: {
            // Home icon
            path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
            fillColor: '#FFD403',
            strokeColor: '#FFB804',
            fillOpacity: 0.8,
        },
        library: {
            // Book icon
            path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
            fillColor: '#D20104',
            strokeColor: '#8B0000',
            fillOpacity: 0.8,
        },
        parking: {
            // Local parking icon
            path: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
            fillColor: '#D20104',
            strokeColor: '#8B0000',
            fillOpacity: 0.8,
        },
        recreational: {
            // Local event icon
            path: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z',
            fillColor: '#006ECE',
            strokeColor: '#01008A',
            fillOpacity: 0.8,
        },
        service: {
            // Business center icon
            path: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z',
            fillColor: '#FF6600',
            strokeColor: '#CA4729',
            fillOpacity: 0.8,
        },
    };
}
