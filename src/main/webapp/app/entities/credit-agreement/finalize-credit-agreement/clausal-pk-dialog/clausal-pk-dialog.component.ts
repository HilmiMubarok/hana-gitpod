import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import { CreditAgreementClausal, ICreditAgreementClausal } from '../agreement-clausal.model';

@Component({
  selector: 'jhi-clausal-pk-dialog',
  templateUrl: './clausal-pk-dialog.component.html',
})
export class ClausalPkDialogComponent {
  public loading: boolean;
  public dataClausalAgreement: any[] = [];
  public agreementClausal: ICreditAgreementClausal = new CreditAgreementClausal();

  public clausalAgreement: any[];
  constructor(
    public dialogRef: MatDialogRef<ClausalPkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public creditAgreementService: CreditAgreementService
  ) {
    this.getClausalAgreement();
    this.loading = false;
  }
  public displayColumnsCreditAgreementClausal: string[] = ['code', 'category', 'description', 'action'];

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getClausalAgreement() {
    this.creditAgreementService
      .getClausalParameterAll({
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        this.clausalAgreement = res.body.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));
      });
  }

  hasSameAgreementId(element: any): boolean {
    const data = this.data.dataClausal.filter((res: any) => res.agreementClausalParameterId === element.id);

    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public onCheckboxChange(event: any, element: any) {
    if (event.checked === true) {
      this.dataClausalAgreement.push(element);
    } else if (event.checked === false) {
      this.dataClausalAgreement = this.dataClausalAgreement.filter((data: any) => data.id !== element.id);
    }
  }

  public saveClausal() {
    for (let i = 0; i < this.dataClausalAgreement.length; i++) {
      this.agreementClausal = {
        ...this.agreementClausal,
        agreementClausalParameterId: this.dataClausalAgreement[i].id,
        id: null,
        category: this.agreementClausal.category,
        agreementId: this.data.agreement.length > 0 ? this.data.agreement[0].id : 0,
      };

      this.creditAgreementService.saveClausalAgreement(this.agreementClausal).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
