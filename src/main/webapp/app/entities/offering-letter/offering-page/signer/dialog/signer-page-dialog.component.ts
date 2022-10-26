import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import lodash from 'lodash';
import { BrowserModule } from '@angular/platform-browser';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOfferingLetter } from '../../offering-page.model';

@Component({
  selector: 'jhi-signer-page-dialog',
  templateUrl: './signer-page-dialog.component.html',
  styleUrls: ['./signer-dialog.css'],
})
export class OfferingLetterSignerPageDialogComponent {
  private _creditproposal: ICreditProposal;
  public dataItem: ICreditProposal;
  public offeringLetter: IOfferingLetter;

  public listOfValue = {
    signerList: ['Debitor', 'Pt. Bank Keb Hana Indonesia'],
  };
  public onSelectSigner: string;
  public isShow: boolean;
  public debitorNameGroup: any[];
  public getName: any[];

  @Input()
  get creditProposal() {
    return this._creditproposal;
  }
  set creditProposal(param: ICreditProposal) {
    this._creditproposal = param;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      offeringLetter: IOfferingLetter;
    },
    public employeService: EmployeeService,
    private _dialog: MatDialogRef<OfferingLetterSignerPageDialogComponent>
  ) {
    this.dataItem = this.data.object;
    this.offeringLetter = this.data.offeringLetter;
  }
  // ngOnInit(): void {
  // this.getDataName()
  // }

  // onChangeName(value: string){
  //   return value;
  // }

  onChangeValue(value: string) {
    if (value === 'Debitor') {
      if (sessionStorage.getItem('debitorType') === 'Debitor') {
        this.isShow = true;
      }
    } else if (value === 'Pt. Bank Keb Hana Indonesia') {
      this.isShow = false;
    }
  }

  // get Name if debitor == Bank Hana
  // private getDataName(){
  //   this.employeService.queryFilterBy({isAvailable: true, internalId: 10000, page: 0, size: 999}).subscribe(res =>{
  //     this.debitorNameGroup =  res.body;
  //     for( let i = 0; i < this.debitorNameGroup.length; i++){
  //       this.debitorNameGroup[i].person.name;
  //       this.debitorNameGroup.toString();
  //     }
  //   })

  // }

  public save(): void {
    this._dialog.close(this.offeringLetter);
  }
}
