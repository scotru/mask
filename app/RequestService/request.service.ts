//This is here just for testing. It should eventually be put in a separate git repo
//or be bundled with a base ASWWU project.

import { Injectable } from '@angular/core';

import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { SERVER_URL, COOKIE_DOMAIN } from '../config';
import {User} from "./user.model";

@Injectable()
export class RequestService {
  private authUser: User;

  private setCurrentUser(user: any): void {
    if(user.hasOwnProperty("wwuid") && user.wwuid) {
      this.authUser = new User(user);
    } else {
      this.authUser = undefined;
    }
  }

  // Gets current user and sets it to authUser
  // Also returns the user object to the calback function. 
  verify(cb?: any): void {
    this.get("verify", data => {
      //Log in the user
      console.log('Log in user');
      var user = data.user || null;
      this.setCurrentUser(user);
      if(typeof cb == "function") cb(user);
    }, err => {
        //user in not logged in remove authUser.
        this.setCurrentUser({});
        if(typeof cb == "function") cb(null);
    });
  }


  constructor(private http: Http) { }

  private createRequest(uri: string): any {
    let url = uri;
    if (url.indexOf("http")) {
      url = SERVER_URL;
      if (url.split('').pop() != '/' && uri[0] != '/') url += '/';
      url += uri;
    }

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return { url: url, options: options };
  }


  get(uri: string, afterRequest, catchError): void {
    let req = this.createRequest(uri);
    this.http.get(req.url,req.options)
      .map(res => res.json())
      .subscribe(
        data => afterRequest(data),
        err => (catchError ? catchError(err) : console.error(err))
      );
  }
  post(uri: string, data: any, afterRequest, catchError): void {
    let body = JSON.stringify(data);
    let req = this.createRequest(uri);
    this.http.post(req.url, body, req.options)
      .map(res => res.json())
      .subscribe(
        data => afterRequest(data),
        err => (catchError ? catchError(err) : console.error(err))
      );
  }

}
