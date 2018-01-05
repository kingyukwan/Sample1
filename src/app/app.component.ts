import { Component } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';
import { User } from './user';
import { Order } from './order';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // Define a users property to hold our user data
  //users: Array<any>;
  //orders: Array<any>;
  //textreturn = 'init';
  return: any;
  userJson: any;
  userGet = new User('','');
  order = new Order('','');
  succeed = false;

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    this.succeed = false;
    // Access the Data Service's getUsers() method we defined
    //this._dataService.getUsers()
        //.subscribe(res => this.users = res);
      //this._dataService.getUsersInit()
        //.subscribe(res => this.users = res);
      //this._dataService.getOrdersInit()
        //.subscribe(res => this.orders = res);
    //this._dataService.getUsersByNum('C2')
    //    .subscribe(res => this.userJson = res);
  }

  /*onClickMe(inputSrh: string): void {
    console.log(inputSrh);
    this.textreturn = 'testreturn';
  }*/

  onSubmit(form: any) { 
    //this._dataService.getUsersByNum(form.custNum)
    //.subscribe(res => this.users = res);
    /*this._dataService.getUsersByNum(form.custNum)
    .subscribe(res => this.collectUser(res));*/
    /*this._dataService.getOrdersByUser(form.custNum)
    .subscribe(res => this.orders = res);*/
    //this._dataService.orderSubmit(form.custNum, this.order)
    this._dataService.orderSubmit(this.userGet, this.order)
    //.subscribe(res => this.return = res);
    .subscribe(res => {
      this.return = res;
      console.log('yylog'+ res);
      this.succeed = true;
    });
  }

  collectUser(userRtn: Array<any>){
    console.log('collectUser');
    this.userJson = userRtn[0];
    this.userGet.num = this.userJson.cust_num;
    this.userGet.name = this.userJson.cust_name;
    //console.log('yylog', this.userGet.name);
  }

  reset(){
    this.userGet = new User('','');
    this.order = new Order('','');
    this.succeed = false;
  }

  loadData(form: any){
    this._dataService.getUsersByNum(this.userGet.num)
    .subscribe(res => this.collectUser(res));
    this.succeed = false;
  }
}