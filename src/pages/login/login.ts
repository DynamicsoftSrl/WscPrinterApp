import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { HomePage } from './../home/home';
import { LoginForm } from '../../models/login-form';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent implements OnInit {

  constructor(private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {
  }

  public loginFormGroup: FormGroup;
  public model: LoginForm = new LoginForm();

  ngOnInit(): void {

    //validation of login form via FormBuilder
    this.loginFormGroup = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      Domain: ['', Validators.required]
    });
  }

  //validation part getters for username, password and domain
  get username() {
    return this.loginFormGroup.get('Username')
  }

  get password() {
    return this.loginFormGroup.get('Password')
  }

  get domain() {
    return this.loginFormGroup.get('Domain')
  }

  onLogin() {
    this.navCtrl.push(HomePage, {
      loginFormData: this.model
    });
  }
}
