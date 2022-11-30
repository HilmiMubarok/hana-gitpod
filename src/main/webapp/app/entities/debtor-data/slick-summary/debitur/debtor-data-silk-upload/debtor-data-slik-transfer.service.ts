import { Injectable } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DebtorDataSlikTransferService {

  public acceptedArray: Subject<any> = new Subject();
  acceptedArraySubject = this.acceptedArray.asObservable();
  partySliks: IPartySlik[];

  constructor()
  {
    this.acceptedArray.subscribe(item => {
      this.partySliks = item;
    });
  }

  addToAccepted(item: IPartySlik[]) {
    console.log("item", item);
    this.acceptedArray.next(item);
  }

  getSliks() {
    return this.partySliks;
  }
}
