import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import { CreditAgreementClausal, ICreditAgreementClausal } from '../agreement-clausal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

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
    private dialog: MatDialog,
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }

  private getBucket(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve(res.body['bucket']);
      });
    });
  }

  public addCountCildAgreementsForm(): void {
    this.countChildFormAgreements.push({});
    this.valueChildAgreeements.push('');
  }

  public deleteCountCildAgreementsForms(i: number): void {
    const dataToRemove = this.valueChildAgreeements[i];

    this.valueChildAgreeements.splice(i, 1);
    this.countChildFormAgreements.splice(i, 1);
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
        this.clausalAgreement = data
          .filter(obj1 => !this.data.dataClausal.some(obj2 => obj2.agreementClausalParameterId === obj1.id))
          .filter(obj => obj.statusCode === 'ACTIVE');
      });

    this.creditAgreementService.agreementClausalTemplate(this.data.creditProposal.agreements[0]?.id).subscribe((res: any) => {
      this.agreementsClausalTemplate = res.body;
    });

    this.creditAgreementService.agreementsClausalByPartyId(this.data.creditProposal.agreements[0]?.toPartyId).subscribe((res: any) => {
      const data: any[] = res.body;
      // Sort data desc by sequence
      data.sort((a, b) => (a.sequence > b.sequence ? 1 : -1));
      this.addendumListActive = data.filter(obj => obj.statusCode === 'ACTIVE');
    });

    this.creditAgreementService.agreementsAddendumApplication(this.data.creditProposal.id).subscribe((res: any) => {
      this.creditAgreementService
        .getAddendumActive('ADDENDUM', {
          page: 0,
          size: 9999,
        })
        .subscribe((res1: any) => {
          const data: any[] = res1.body;
          this.agreementsClausalChildList = data
            .filter((r: any) => r.parameterCategoryId === 'ADDENDUM')
            .filter(item1 => !res.body.find(item2 => item1.description === item2.clausal.agreementClausalParameterDescription));
        });
    });
  }

  public optionChildAgrementAddedum(index: number): any[] {
    const selectedOptions = this.addendumListActive.slice(0, index);
    return this.addendumListActive.filter(option => !selectedOptions.includes(option));
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

  public addendumListActiveLov(index: number): any[] {
    const valueChildAgreeements = this.valueChildAgreeements;
    const dataToRemove = this.valueChildAgreeements[index];
    const activeAddendum = this.addendumListActive;

    console.log('hshfkjasdgfkhjagsdkf', valueChildAgreeements, dataToRemove, activeAddendum);

    if (dataToRemove) {
      // Find dataToRemove index in activeAddendum based on dataToRemove.id
      const indexToRemove = activeAddendum.findIndex((res: any) => res.id === dataToRemove.id);

      // Slice activeAddendum
      const selectedOptions = activeAddendum.slice(0, indexToRemove);

      return this.addendumListActive.filter(option => !selectedOptions.includes(option));
    } else {
      return this.addendumListActive;
    }
  }

  public changeClildAgreements(event: any, i: number) {
    this.valueChildAgreeements[i] = event.value;
  }

  public saveClausal() {
    if (this.agreementClausal.category === 'ADDENDUM') {
      const clausal: any = Object.assign({}, this.agreementsClausalTemplate);

      clausal.agreementClausalParameterCode = this.valueParentClausalAgreements.code;
      clausal.agreementClausalParameterDescription = this.valueParentClausalAgreements.description;
      clausal.statusCode = this.valueParentClausalAgreements.statusCode;
      clausal.statusDescription = this.valueParentClausalAgreements.statusDescription;
      clausal.agreementClausalParameterId = this.valueParentClausalAgreements.id;
      delete clausal.id;
      delete clausal.category;
      clausal.id = null;
      clausal.category = this.agreementClausal.category;
      let clausalChild = [];

      for (let i = 0; i < this.countChildFormAgreements.length; i++) {
        if (this.valueParentClausalAgreements?.code === 'AD-16') {
          const filteraddendumListActive = this.addendumListActive.filter((res: any) => res.id === this.valueChildAgreeements[i].id);

          filteraddendumListActive.forEach((item: any) => {
            item.agreementId = this.data.agreement.length > 0 ? this.data.agreement[0].id : 0;
            item.addendumToId = item.id;
            item.id = null;
          });
          clausalChild = [...clausalChild, ...filteraddendumListActive];
        } else {
          clausalChild = [];
        }
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
