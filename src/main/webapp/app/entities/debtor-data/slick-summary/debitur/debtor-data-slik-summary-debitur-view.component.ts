import { Component, OnInit } from '@angular/core';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { MatDialog } from '@angular/material/dialog';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { DebtorDataSlikTransferService } from './debtor-data-silk-upload/debtor-data-slik-transfer.service';
import _ from 'lodash';
import { StorageService } from 'app/entities/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { DebtorDataViewUploadComponent } from './debtor-data-silk-upload/debtor-data-view-upload-slik.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur-view',
  templateUrl: './debtor-data-slik-summary-debitur-view.component.html',
  styleUrls: ['./debtror-data-slik-summary-debitur-view.style.scss'],
})
export class DebtorDataSlikSummaryDebiturViewComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit {
  public loading: boolean;
  public folders = [];
  public bucket: string;
  public parentPath = this.router.url.split('/')[1];
  public isCpApproval: boolean;
  partyId;

  public bulan: any = [
    {
      id: 1,
      name: 'Jan',
    },
    {
      id: 2,
      name: 'Feb',
    },
    {
      id: 3,
      name: 'Mar',
    },
    {
      id: 4,
      name: 'Apr',
    },
    {
      id: 5,
      name: 'Mei',
    },
    {
      id: 6,
      name: 'Jun',
    },
    {
      id: 7,
      name: 'Jul',
    },
    {
      id: 8,
      name: 'Agu',
    },
    {
      id: 9,
      name: 'Sep',
    },
    {
      id: 10,
      name: 'Okt',
    },
    {
      id: 11,
      name: 'Nov',
    },
    {
      id: 12,
      name: 'Des',
    },
  ];
  private id: string;
  private selectedManagementType: any;
  public displayedColumns: string[] = ['no', 'fileName', 'date', 'fileSize', 'action'];
  public partyCif: IPartyCif | null = null;
  public partyCifStartState: IPartyCif | null = null;
  public downloadData: any = [];

  constructor(
    public partySlikService: PartySlikService,
    public reportUtilService: ReportUtilService,
    protected _snackBar: MatSnackBar,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public TransferService: DebtorDataSlikTransferService,
    private storageService: StorageService,
    private router: Router,
    public creditProposalService: CreditProposalService,
    protected organizationManagementService: OrganizationManagementService
  ) {
    super(_snackBar, partySlikService);
    this.loading = false;
    console.log(this.router.getCurrentNavigation().extras.state);
    this.partyCif = this.activatedRoute.snapshot.data['content'];
    this.partyCifStartState = this.activatedRoute.snapshot.data['content'];
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.partyId = this.activatedRoute.snapshot.paramMap.get('managementType');
    // this.selectedManagementType = this.activatedRoute.snapshot.data.selectedManagementType;
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(event => {
      this.selectedManagementType = event.managementType;
    });
    this.getFiles();
  }

  public setPartyId: any;

  dataSource;
  private getFiles(): void {
    const idPartySlik = sessionStorage.getItem('idParty');
    const subFolder = [];
    this.folders = [];
    const predicate: Object = {
      key: `/party_slik/${this.partyId}`,
    };
    this.storageService.getBucketName().subscribe((response: any) => {
      this.storageService.getObjects(response.body.bucket, predicate).subscribe((res: any) => {
        this.dataSource = res.body;
      });
    });
  }

  // view data with selection
  public viewFileBySelection(event: MatCheckboxChange, data: any): void {
    const value: boolean = event.checked;
    if (value) {
      this.downloadData.push(data);
    } else {
      const delParam: any = [];
      delParam.push(data);
      this.downloadData = this.downloadData.filter(param => !delParam.includes(param));
    }
  }

  // download File
  public download() {
    if (this.downloadData.length === 0) {
      alert('Select Data First');
    } else {
      for (let i = 0; i < this.downloadData.length; i++) {
        this.reportUtilService.downloadFileBYName(this.downloadData[i].url, this.downloadData[i].tags);
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  // open dialog view
  public viewDialog(element) {
    const passedData: any = [];
    passedData.push(element);
    const predicate: object = {
      width: '40vw',
      data: passedData,
    };
    const dialogRef = this.dialog.open(DebtorDataViewUploadComponent, predicate);
    dialogRef.afterClosed().subscribe();
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }
}
