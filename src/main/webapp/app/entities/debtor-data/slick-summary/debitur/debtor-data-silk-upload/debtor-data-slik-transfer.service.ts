import { Injectable } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DebtorDataSlikTransferService {

  public paramSource = new BehaviorSubject(null);
  sharedParam = this.paramSource.asObservable();

  public arrSliks: Object[];

  constructor() { }

  setparam(param: any[]) {
    // this.paramSource.next(param);

    this.arrSliks =  _.concat(this.arrSliks,param);
    // console.log("isi", this.paramSource.value);
    console.log("isi", this.arrSliks);
  }

  removeValue(param: any) {
    // const newArray = _.remove(this.paramSource.value, function(n) {
    //   return n === param;
    // });

    const newArray = _.remove(this.arrSliks, function(n) {
      return n === param;
    });
  }

  getparam() {
    // return this.paramSource.asObservable();

    return this.arrSliks;
  }
}
