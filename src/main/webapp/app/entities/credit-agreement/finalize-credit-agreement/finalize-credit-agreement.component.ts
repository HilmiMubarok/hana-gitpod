import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';
import { SignerPerjanjialKreditDialogComponent } from './signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { MessageService } from 'primeng/api';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ReviewHistoryDialogComponent } from '../review-history-dialog/review-history-dialog.component';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { CreditAgreementService } from '../credit-agreement.service';
import { ClausalPkDialogComponent } from './clausal-pk-dialog/clausal-pk-dialog.component';
import { ClausalPkDialogComponentEditComponent } from './clausal-pk-dialog/clausal-pk-dialog-edit.component';
import { CashCreditProposalsService } from 'app/entities/cash-credit-proposal/cash-credit-proposals.service';
import { IEntityProperties } from 'app/entities/entity-properties/entity-properties.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { INotes } from 'app/entities/notes/notes.model';
@Component({
  selector: 'jhi-finalize-credit-agreement',
  templateUrl: './finalize-credit-agreement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAgreementComponent implements OnInit, OnChanges {
  public dataAgreement: any[] = [];
  public approvalDebtor: any[] = [1];
  public postalAdresss: IPostalAddress;
  public valueApprovalDebtor: any[];
  public selectedConditions: any[] = []; // Initialize as needed
  selectedConditionsValue: any = [];
  approvalDebtorOptions: string[] = [];
  selectedOptions: string[] = [];
  public dataClausal: any[];
  public _creditProposal;
  selectedCondition: any = '';
  public letterOfName: string;
  public templateProperties: IEntityProperties;
  public bucket: string;
  public addendumClausalAgreements: any[] = [];
  public addendumClausalAgreementsHistory: any[] = [];

  public displayColumns = ['No', 'Name', 'Debitor', 'Position', 'Action'];
  public displayColumnsDraftPerjanjianKredit = ['no', 'fileName', 'date', 'createdBy', 'sizeFile', 'action'];
  public displayRevewHistory = ['no', 'approveName', 'position', 'date', 'action'];
  public displayColumnsCreditAgreementClausal: any[];
  public displayColumnsGenerateDraftCreditAgreement = ['no', 'filename', 'date', 'createdby', 'sizefile', 'action'];
  public displayColumnsCreditAgreementClausalHisotry = ['no', 'category', 'description', 'action'];
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;

    if (this._creditProposal.entityProperties.length < 1) {
      this.cashCreditProposalsService.getEntityPropResource(this._creditProposal.id, 'APPROVAL_DEBTOR_CONDITIONS').subscribe((res: any) => {
        this.creditProposal.entityProperties = [res.body];
      });
    }
  }
  public data = [];
  public loading: boolean;

  @Output() notesChange = new EventEmitter<INotes>();

  onNotesChange(ev) {
    this.notesChange.emit(ev);
  }

  constructor(
    private dialog: MatDialog,
    public messageService: MessageService,
    public generalParameterService: GeneralParameterService,
    public creditAgreementService: CreditAgreementService,
    public messageSeervice: MessageService,
    private storageService: StorageService,
    public cashCreditProposalsService: CashCreditProposalsService
  ) {
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.creditProposal = changes['creditProposal'].currentValue;
    }
  }

  ngOnInit(): void {
    this.dataAgreement = JSON.parse(this.creditProposal.agreements[0]?.attributes.SIGNERS);
    this.getClausalAgreement();
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });
    this.approvalConditionStatus();

    if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'NEW') {
      this.displayColumnsCreditAgreementClausal = ['no', 'category', 'description', 'action'];
    } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'ADDENDUM') {
      this.displayColumnsCreditAgreementClausal = ['code', 'category', 'description', 'clausal', 'action'];
    } else {
      this.displayColumnsCreditAgreementClausal = ['no', 'category', 'description', 'action'];
    }

    this.getApprovalDebtorConditions();
    this.getClausalAddendum();
  }

  clearApprovalDebtorConditions() {
    const entityProperties = this.creditProposal.entityProperties;

    // filter where entityProperties.entityPropertyTypeId === "APPROVAL_DEBTOR_CONDITIONS"
    entityProperties.forEach((entityProperty, index) => {
      if (entityProperty.entityPropertyTypeId === 'APPROVAL_DEBTOR_CONDITIONS') {
        // Find where approvalDebtorConditionStatus === null
        if (entityProperty.approvalDebtorConditionStatus === null || entityProperty.approvalDebtorConditionStatus === '') {
          // Delete
          this.cashCreditProposalsService.deletePropsResource(entityProperty.id).subscribe(() => {
            entityProperties.splice(index, 1);
          });
        }
      }
    });

    this.creditProposal.entityProperties = entityProperties;
  }

  public getApprovalDebtorConditions() {
    this.clearApprovalDebtorConditions();
    if (this.creditProposal.entityProperties.length > 1) {
      for (let i = 0; i < this.creditProposal.entityProperties.length - 1; i++) {
        this.selectedConditions[i] = this.creditProposal.entityProperties[i].approvalDebtorConditionStatus;
        if (this.creditProposal.customerType !== 'PERSONAL') {
          this.approvalDebtor.push({});
        }
        this.selectedConditions.push('');
      }
    }

    for (let i = 0; i < this.creditProposal.entityProperties.length; i++) {
      this.selectedConditions[i] = this.creditProposal.entityProperties[i].approvalDebtorConditionStatus;
    }
  }

  public onSelectAgreementType(event: any) {
    this.creditProposal.agreements[0].attributes.AGREEMENT_TYPE = event.value;

    if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'NEW') {
      this.displayColumnsCreditAgreementClausal = ['no', 'category', 'description', 'action'];
    } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'ADDENDUM') {
      this.displayColumnsCreditAgreementClausal = ['code', 'category', 'description', 'clausal', 'action'];
    } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'Perubahan dan Pernyataan Kembali') {
      this.displayColumnsCreditAgreementClausal = ['no', 'category', 'description', 'action'];
    }
  }

  public approvalConditionStatus() {
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.generalParameterService
        .queryFilterBy({
          idParameterType: 'APPROVAL_DEBTOR_PERSONAL',
          page: 0,
          size: 9999,
        })
        .subscribe((res: any) => {
          this.selectedConditionsValue = res.body;

          for (let i = 0; i < res.body.length; i++) {
            this.approvalDebtorOptions = [...this.approvalDebtorOptions, res.body[i].value];
          }
        });
    } else {
      this.generalParameterService
        .queryFilterBy({
          idParameterType: 'APPROVAL_DEBTOR_CORPORATE',
          page: 0,
          size: 9999,
        })
        .subscribe((res: any) => {
          this.selectedConditionsValue = res.body;

          for (let i = 0; i < res.body.length; i++) {
            this.approvalDebtorOptions = [...this.approvalDebtorOptions, res.body[i].value];
          }
        });
    }
  }

  public updateClausalDialog(element: any, status: any) {
    const dialogRef = this.dialog.open(ClausalPkDialogComponentEditComponent, {
      width: '200vh',
      height: '100vh',
      data: {
        dataClausal: element,
        creditProposal: this.creditProposal,
        view: status,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getClausalAgreement();
      this.getClausalAddendum();
    });
  }

  public addClausalDialog() {
    const dialogRef = this.dialog.open(ClausalPkDialogComponent, {
      width: '200vh',
      height: '100vh',
      data: {
        dataClausal: this.dataClausal,
        agreement: this.creditProposal.agreements,
        creditProposal: this.creditProposal,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getClausalAgreement();
      this.getClausalAddendum();
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  public deleteSigner(element: any) {
    this.dataAgreement = this.dataAgreement.filter((data: any) => data.id !== element.id);
    this.creditProposal.agreements[0].attributes = {
      ...this.creditProposal.agreements[0].attributes,
      SIGNERS: JSON.stringify(this.dataAgreement),
    };
  }
  private getBucket(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve(res.body['bucket']);
      });
    });
  }
  public deleteClausal(element: any): void {
    this.getBucket().then(() => {
      this.storageService
        .deleteFile(
          this.bucket,
          `aggrement/${this.creditProposal.agreements[0]?.id}/${element.id}/docs/credit-agreement-clausal-${element.agreementClausalParameterCode}.docs`
        )
        .subscribe(() => {
          this.storageService
            .deleteFile(
              this.bucket,
              `aggrement/${this.creditProposal.agreements[0]?.id}/${element.id}/sfdt/credit-agreement-clausal-${element.agreementClausalParameterCode}.sfdt`
            )
            .subscribe(() => {
              this.creditAgreementService.deleteClausalAgreement(Number(element.id)).subscribe(
                (res: any) => {
                  if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'ADDENDUM') {
                    this.getClausalAddendum();
                  } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'NEW') {
                    this.getClausalAgreement();
                  } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'Perubahan dan Pernyataan Kembali') {
                    this.getClausalAgreement();
                  }
                },
                (error: any) => {
                  if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'ADDENDUM') {
                    this.getClausalAddendum();
                  } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'NEW') {
                    this.getClausalAgreement();
                  } else if (this.creditProposal.agreements[0]?.attributes.AGREEMENT_TYPE === 'Perubahan dan Pernyataan Kembali') {
                    this.getClausalAgreement();
                  }
                }
              );
            });
        });
    });
  }

  public getClausalAgreement() {
    this.creditAgreementService
      .retriveClausalAgreementData(this.creditProposal.agreements.length > 0 ? this.creditProposal.agreements[0].id : 0, {
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        const data: any[] = res.body;
        this.dataClausal = data.filter((a: any) => a.category !== 'ADDENDUM');
      });
  }

  public getClausalAddendum() {
    this.creditAgreementService.getActiveClausalById(this.creditProposal.id, 'DRAFT').subscribe((res: any) => {
      const data: any[] = this.combineClausal(res.body);
      this.addendumClausalAgreements = data.slice().sort((a, b) => a.sequence - b.sequence);
    });

    this.creditAgreementService.agreementsClausalByPartyId(this.creditProposal.cif.partyId).subscribe((res: any) => {
      const data: any[] = res.body;
      this.addendumClausalAgreementsHistory = data.slice().sort((a, b) => a.sequence - b.sequence);
    });
  }

  public combineClausal(data: any[]) {
    const combinedArray = [];

    data.forEach(item => {
      if (item.clausal) {
        combinedArray.push(item.clausal);
      }
      if (item.clausalChild) {
        combinedArray.push(...item.clausalChild);
      }
    });
    return combinedArray;
  }

  public openDialogSigner(data: any) {
    const dialogRef = this.dialog.open(SignerPerjanjialKreditDialogComponent, {
      data: {
        agreement: this.creditProposal.agreements.length > 0 ? this.creditProposal.agreements[0].attributes : '',
        creditProposal: this.creditProposal,
        element: data,
      },
      width: '120vh', // Ganti nilai ini sesuai kebutuhan lebar dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.element === null) {
        if (result !== null && result !== undefined) {
          if (this.creditProposal.agreements.length > 0) {
            this.dataAgreement = [...this.dataAgreement, result];

            this.creditProposal.agreements[0].attributes = {
              ...this.creditProposal.agreements[0].attributes,
              SIGNERS: JSON.stringify(this.dataAgreement),
            };
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Agreement is empty' });
          }
        }
      } else {
        const index = this.dataAgreement.findIndex(item => item.id === result.id);
        this.dataAgreement[index]['name'] = result.name;
        this.dataAgreement[index]['debitor'] = result.debitor;
        this.dataAgreement[index]['position'] = result.position;

        this.creditProposal.agreements[0].attributes = {
          ...this.creditProposal.agreements[0].attributes,
          SIGNERS: JSON.stringify(this.dataAgreement),
        };
      }
    });
  }

  addApproval() {
    if (this.creditProposal.customerType === 'PERSONAL') {
      if (this.approvalDebtor.length < 1) {
        this.cashCreditProposalsService
          .getEntityPropResource(this.creditProposal.id, 'APPROVAL_DEBTOR_CONDITIONS')
          .subscribe((res: any) => {
            this.creditProposal.entityProperties = [...this.creditProposal.entityProperties, res.body];
            this.approvalDebtor.push({});
            this.selectedConditions.push('');
          });
      }
    } else {
      if (this.approvalDebtor.length < 2) {
        this.cashCreditProposalsService
          .getEntityPropResource(this.creditProposal.id, 'APPROVAL_DEBTOR_CONDITIONS')
          .subscribe((res: any) => {
            this.creditProposal.entityProperties = [...this.creditProposal.entityProperties, res.body];
            this.approvalDebtor.push({});
            this.selectedConditions.push('');
          });
      }
    }
  }

  deleteApproval(index: number) {
    this.cashCreditProposalsService.deletePropsResource(this.creditProposal.entityProperties[1].id).subscribe(() => {
      this.creditProposal.entityProperties.splice(index, 1);
      if (this.approvalDebtor.length > 1) {
        this.approvalDebtor.splice(index, 1);
        this.selectedConditions.splice(index, 1);
        this.selectedOptions.splice(index, 1);
      }
    });
  }

  onSelectApprovalCondition(selectedValue: any, index: any) {
    if (this.selectedConditions[0] === this.selectedConditions[1]) {
      this.cashCreditProposalsService.deletePropsResource(this.creditProposal.entityProperties[1].id).subscribe(() => {
        // Handle the change event here
        this.creditProposal.entityProperties[index].approvalDebtorConditionStatus = selectedValue;
        this.approvalDebtor.splice(1, 1);
        this.selectedConditions.splice(1, 1);
        this.selectedOptions.splice(1, 1);
        this.creditProposal.entityProperties.splice(index, 1);
        const filter = this.selectedConditionsValue.filter((data: any) => data.value === selectedValue);
        this.selectedOptions[index] = filter[0].id;
      });
    } else {
      this.creditProposal.entityProperties[index].approvalDebtorConditionStatus = selectedValue;

      const filter = this.selectedConditionsValue.filter((data: any) => data.value === selectedValue);
      this.selectedOptions[index] = filter[0].id;
    }

    // You can do more with the selected value if needed
  }

  public selectedConditionId(name: string) {
    const filter = this.selectedConditionsValue.filter((data: any) => data.value === name);
    return filter.length > 0 ? filter[0].id : '';
  }

  getAvailableOptions(index: number): string[] {
    // Exclude options already selected in previous mat-select instances

    const selectedOptions = this.selectedConditions.slice(0, index);
    return this.approvalDebtorOptions.filter(option => !selectedOptions.includes(option));
  }

  public addReviewHistory(): void {
    const dialogRef = this.dialog.open(ReviewHistoryDialogComponent, {
      data: {
        title: 'Hello Dialog',
        message: 'This is a message from the main component!',
      },
      width: '200vh',
      height: '100vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  public addRow() {}
}
