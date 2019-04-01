
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import {map, tap, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { NavbarService } from '../../../service/navbar.service';
import { SidebarService } from '../../../service/sidebar.service';
import { AuthenticationService } from '../../../service/authentication.service';
import { UserService } from '../../../service/user.service';

import { User } from 'src/app/model/user';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { Observable, empty } from 'rxjs';

@Component({
  selector: 'app-create-advisor',
  templateUrl: './create-advisor.component.html',
  styleUrls: ['./create-advisor.component.css']
})
export class CreateAdvisorComponent implements OnInit {

  form: FormGroup;
  tech = ['MACD', 'SMA', 'EMA', 'WMA', 'RSI', 'STOCHRSI', 'STOCH', 'WILLR', 'ULTOSC', 'ADXR', 'MOM', 'CCI'];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      tech: this.buildTechnicals()
    });
  }

  buildTechnicals() {

    const values = this.tech.map(v => new FormControl(false));

    return this.formBuilder.array(values);

  }

  submit() {
    let valueSubmitt = Object.assign({}, this.form.value);

    valueSubmitt = Object.assign(valueSubmitt, {
      tech: valueSubmitt.tech
        .map((v, i) => v ? this.tech[i] : null)
        .filter(v => v !== null)
    });
  }
}

