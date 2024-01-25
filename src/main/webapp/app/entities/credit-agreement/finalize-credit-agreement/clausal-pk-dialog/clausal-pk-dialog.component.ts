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
  public addendumListActive: any[] = [];
  public agreementsClausalTemplate: any;
  public countChildFormAgreements: any = [''];
  public valueChildAgreeements: any[] = [];
  public agreementsClausalChildList: any[] = [];
  public valueParentClausalAgreements: any;

  public clausalAgreement: any[];
  constructor(
    private storageService: StorageService,
    public dialogRef: MatDialogRef<ClausalPkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    public creditAgreementService: CreditAgreementService
  ) {
    this.loading = false;
    this.agreementClausal = {
      category: this.data.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE,
    };
    this.getClausalAgreement();
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

  // public cildAgreementSelection(event: any, i: number){
  //   console.log('event', event.value)
  //   this.valueChildAgreeements[i] = event.value
  // }
  public addCountCildAgreementsForm(): void {
    this.countChildFormAgreements.push({});
    this.valueChildAgreeements.push('');
  }

  public deleteCountCildAgreementsForm(i: number): void {
    this.countChildFormAgreements.splice(i, 1);
    this.valueChildAgreeements.splice(i, 1);
  }

  public getClausalAgreement() {
    this.creditAgreementService
      .getClausalParameterAll({
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        const data = res.body
          .sort((a, b) => (a.sequence > b.sequence ? 1 : -1))
          .filter((res1: any) => res1.parameterCategoryDescription === 'New');
        this.clausalAgreement = data.filter(obj1 => !this.data.dataClausal.some(obj2 => obj2.agreementClausalParameterId === obj1.id));
      });

    this.creditAgreementService
      .getAddendumActive('ADDENDUM', {
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        this.agreementsClausalChildList = res.body;
      });

    this.creditAgreementService.agreementClausalTemplate(this.data.creditProposal.agreements[0]?.id).subscribe((res: any) => {
      this.agreementsClausalTemplate = res.body;
    });

    this.creditAgreementService.agreementsClausalByPartyId(this.data.creditProposal.agreements[0]?.toPartyId).subscribe((res: any) => {
      this.addendumListActive = res.body.filter((data: any) => data.category === 'ADDENDUM');
    });
  }

  public optionChildAgrementAddedum(index: number): any[] {
    const selectedOptions = this.valueChildAgreeements.filter((res: any) => res.parameterCategoryId === 'ADDENDUM').slice(0, index);
    return this.agreementsClausalChildList.filter(option => !selectedOptions.includes(option));
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

  public changeClildAgreements(event: any, i: number) {
    this.valueChildAgreeements[i] = event.value;
  }

  public saveClausal() {
    if (this.agreementClausal.category === 'ADDENDUM') {
      const clausal: any = this.addendumListActive[0];
      delete clausal.id;
      delete clausal.category;
      clausal.id = null;
      clausal.category = this.agreementClausal.category;
      const clausalChild: any[] = [];
      for (let i = 0; i < this.countChildFormAgreements.length; i++) {
        const saveCild = Object.assign({}, this.agreementsClausalTemplate);
        const filteraddendumListActive = this.agreementsClausalChildList.filter(
          (res: any) => res.description === this.valueChildAgreeements[i]
        );
        saveCild.addendumToId = clausal.id;
        saveCild.agreementClausalParameterCode = filteraddendumListActive[0].code;
        saveCild.agreementClausalParameterDescription = filteraddendumListActive[0].description;

        saveCild.statusCode = filteraddendumListActive[0].statusCode;
        saveCild.statusDescription = filteraddendumListActive[0].statusDescription;

        clausalChild.push(saveCild);
      }

      this.creditAgreementService.saveClausalAgreementGroub({ clausal, clausalChild }).subscribe((res: any) => {
        this.dialogRef.close();
      });
    } else {
      this.getBucket().then(() => {
        for (let i = 0; i < this.dataClausalAgreement.length; i++) {
          this.agreementClausal = {
            ...this.agreementClausal,
            agreementClausalParameterId: this.dataClausalAgreement[i].id,
            id: null,
            category: this.agreementClausal.category,
            agreementId: this.data.agreement.length > 0 ? this.data.agreement[0].id : 0,
            notes: this.dataClausalAgreement[i].description,
          };

          this.creditAgreementService.saveClausalAgreement(this.agreementClausal).subscribe((res: any) => {
            this.dialogRef.close();
          });
        }
      });
    }
  }
}
