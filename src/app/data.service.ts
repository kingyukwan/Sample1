import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Order } from './order';
import { User } from './user';

@Injectable()
export class DataService {

  result:any;

  constructor(private _http: Http) { }

  getUsers() {
    return this._http.get("/api/users")
      .map(result => this.result = result.json().data);
  }

  getUsersByNum(inputInfo: string) {
    const postInfo = {custNum: inputInfo};
    return this._http.post("/api/usersByNum", postInfo)
      .map(result => this.result = result.json().data);
      /*return this._http.get("/api/usersByNum")
      .map(result => this.result = result.json().data);*/
  }

  getOrdersByUser(inputInfo: string) {
    const postInfo = {custNum: inputInfo};
    return this._http.post("/api/ordersByUser", postInfo)
      .map(result => this.result = result.json().data);
      /*return this._http.get("/api/usersByNum")
      .map(result => this.result = result.json().data);*/
  }

  orderSubmit(userInfo: User, orderInfo: Order) {
    const postInfo = {custNum: userInfo.num, ordNum: orderInfo.num, ordDate: orderInfo.date};
    return this._http.post("/api/orderSubmit", postInfo)
      .map(result => this.result = result.json().data);
      /*return this._http.get("/api/usersByNum")
      .map(result => this.result = result.json().data);*/
  }

}