import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import { CreditAgreementClausal, ICreditAgreementClausal } from '../agreement-clausal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'jhi-clausal-pk-dialog',
  templateUrl: './clausal-pk-dialog.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class ClausalPkDialogComponent implements OnInit {
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
    private fb: FormBuilder,
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
  public selected;
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

      this.createForm();
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

  public changeClildAgreements(event: any, i: number) {
    this.valueChildAgreeements[i] = event.value;
  }

  assignClausalProperties = (clausal: any, valueParentClausalAgreements: any, agreementClausal: any) => {
    clausal.agreementClausalParameterCode = valueParentClausalAgreements.code;
    clausal.agreementClausalParameterDescription = valueParentClausalAgreements.description;
    clausal.statusCode = valueParentClausalAgreements.statusCode;
    clausal.statusDescription = valueParentClausalAgreements.statusDescription;
    clausal.agreementClausalParameterId = valueParentClausalAgreements.id;
    clausal.id = null;
    clausal.category = agreementClausal.category;
  };

  handleAddendumListActive = (selected: any[], data: any) =>
    selected.flatMap(selectedItem => {
      if (this.valueParentClausalAgreements?.code === 'AD-16') {
        selectedItem.agreementId = data.agreement.length > 0 ? data.agreement[0].id : 0;
        selectedItem.addendumToId = selectedItem.id;
        selectedItem.id = null;
        return selectedItem;
      }
      return [];
    });

  public saveClausal() {
    if (this.agreementClausal.category === 'ADDENDUM') {
      // NEW
      const clausal: any = Object.assign({}, this.agreementsClausalTemplate);
      const selected: any = this.getSelectedValues();

      this.assignClausalProperties(clausal, this.valueParentClausalAgreements, this.agreementClausal);

      const clausalChild = this.handleAddendumListActive(selected, this.data);

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

  // NEW

  form!: FormGroup;
  dropdownOptions: any = [];

  ngOnInit(): void {
    this.createForm();
    this.dropdownsArray.valueChanges.subscribe(() => {
      this.selected = this.getSelectedValues();
      console.log('update selected', this.selected);
    });
  }

  showDropdown() {
    if (this.valueParentClausalAgreements.code === 'AD-16') {
      this.createForm();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      dropdowns: this.fb.array([this.createDropdown()]),
    });
    this.updateDropdownOptions();
  }

  get dropdownsArray(): FormArray {
    return this.form.get('dropdowns') as FormArray;
  }

  createDropdown(): FormGroup {
    return this.fb.group({
      selectedValue: '',
    });
  }

  addDropdown(): void {
    this.dropdownsArray.push(this.createDropdown());
    this.updateDropdownOptions();
  }

  deleteDropdown(index: number): void {
    this.dropdownsArray.removeAt(index);
    this.updateDropdownOptions();
  }

  onDropdownChange(index: number): void {
    this.updateDropdownOptions();
  }

  updateDropdownOptions(): void {
    const selectedValues = this.dropdownsArray.controls.map(control => control.value.selectedValue).filter(value => value);
    this.dropdownOptions = this.dropdownsArray.controls.map((control, index) =>
      this.addendumListActive.filter(
        option => !selectedValues.find((value: any) => value.id === option.id) || option.id === control.value.selectedValue?.id
      )
    );
  }

  getSelectedValues(): any[] {
    return this.dropdownsArray.controls.map(control => control.value.selectedValue).filter(value => value);
  }
}
