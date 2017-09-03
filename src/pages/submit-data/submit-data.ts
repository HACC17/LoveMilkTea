import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'submit-page',
    templateUrl: 'submit-data.html'
})

export class SubmitDataPage {

    constructor(public navCtrl: NavController) {

    }

    ionViewDidLoad() {

    }

    onSubmit(f: NgForm) {
        console.log(f.value);

    }

}