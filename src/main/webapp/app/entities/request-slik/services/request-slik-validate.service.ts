import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, filter, map } from "rxjs";

// Injectable Angular Services
@Injectable({
  providedIn: "root"
})
export class RequestSlikValidateService {

  // // Create observables to handle is validated or not
  private isValidated = new BehaviorSubject<boolean>(false);
  public isValidated$ =  this.isValidated.asObservable();

  private dataToValidate: BehaviorSubject<IRequestSlikValidateData> = new BehaviorSubject<IRequestSlikValidateData>(
    {
      document: false
    }
  )
  private dataToValidate$: Observable<IRequestSlikValidateData> = this.dataToValidate.asObservable();

  // Should validated is minimum document: 1
  private minimumDocument = 1;

  validateDocument(length: number){
    // Set dataToValidate['document'] to true if length is greater equal than minimumDocument
    this.dataToValidate.next({
      document: length >= this.minimumDocument
    });
    this.validate()
  }

  validate() {

    // check if all key has true value, return true if all values are true
    this.dataToValidate$.pipe(
      map(data => this.isValidated.next(Object.values(data).every(value => value))),
    )
  }

}

export interface IRequestSlikValidateData {
  document:boolean
}
