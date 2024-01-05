import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import { CreditAgreementClausal, ICreditAgreementClausal } from '../agreement-clausal.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-clausal-pk-dialog',
  templateUrl: './clausal-pk-dialog.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class ClausalPkDialogComponent {
  public loading: boolean;
  public dataClausalAgreement: any[] = [];
  public agreementClausal: ICreditAgreementClausal = new CreditAgreementClausal();
  public allSelect: boolean;
  public bucket: string;

  public clausalAgreement: any[];
  constructor(
    private storageService: StorageService,
    public dialogRef: MatDialogRef<ClausalPkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    public creditAgreementService: CreditAgreementService
  ) {
    this.getClausalAgreement();
    this.loading = false;
    this.agreementClausal = {
      category: this.data.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE,
    };
  }
  public displayColumnsCreditAgreementClausal: string[] = ['code', 'category', 'description', 'action'];

  onNoClick(): void {
    this.dialogRef.close();
  }

  private getBucket(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve(res.body['bucket']);
      });
    });
  }

  public getClausalAgreement() {
    this.creditAgreementService
      .getClausalParameterAll({
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        const data = res.body.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));

        this.clausalAgreement = data.filter(obj1 => !this.data.dataClausal.some(obj2 => obj2.agreementClausalParameterId === obj1.id));
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

  public selectAll(event: any) {
    if (event.checked === true) {
      this.allSelect = true;
      this.dataClausalAgreement = this.clausalAgreement;
    } else {
      this.allSelect = false;
      this.dataClausalAgreement = [];
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
    this.getBucket().then(() => {
      for (let i = 0; i < this.dataClausalAgreement.length; i++) {
        this.agreementClausal = {
          ...this.agreementClausal,
          agreementClausalParameterId: this.dataClausalAgreement[i].id,
          id: null,
          category: this.agreementClausal.category,
          agreementId: this.data.agreement.length > 0 ? this.data.agreement[0].id : 0,
        };

        this.creditAgreementService.saveClausalAgreement(this.agreementClausal).subscribe((res: any) => {
          this.dialogRef.close();
        });
      }
    });
  }
}
