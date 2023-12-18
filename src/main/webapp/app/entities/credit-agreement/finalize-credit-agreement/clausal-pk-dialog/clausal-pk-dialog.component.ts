import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';

@Component({
  selector: 'jhi-clausal-pk-dialog',
  templateUrl: './clausal-pk-dialog.component.html',
})
export class ClausalPkDialogComponent {
  public loading: boolean;
  public dataClausalAgreement: any[] = [];

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

  public onCheckboxChange(event: any, element: any) {
    if (event.checked === true) {
      this.dataClausalAgreement.push(element);
    } else if (event.checked === false) {
      this.dataClausalAgreement = this.dataClausalAgreement.filter((data: any) => data.id !== element.id);
    }
  }

  public saveClausal() {
    // this.creditAgreementService.saveClausalAgreement(this.dataClausalAgreement).subscribe(() => {
    // })
  }
}
