import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Cif, ICif } from '../cif/cif.model';
import { CollateralAppraisal, ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from '../collateral/collateral.model';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-credit-proposal-new',
  templateUrl: './credit-proposal-new.component.html',
  styleUrls: ['./credit-proposal-list.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreditProposalNewComponent {
  public selection = new SelectionModel<IPartyCif>(true, []);
  public displayedColumns: string[] = ['select', 'no', 'cif', 'customerName', 'customerType', 'createdDate'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public expandedElement: IPartyCif | null;
  public currentSearch: string;
  public partyCifs: IPartyCif[];
  public positionIdLocStor: string;
  constructor(
    private creditProposalService: CreditProposalService,
    private partyCifService: PartyCifService,
    private dialog: MatDialog,
    private router: Router,
    private messageService: MessageService
  ) {
    this.partyCifs = [];
  }

  public search(): void {
    if (this.currentSearch.length !== 10) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Maaf, data CIF yang Anda masukkan harus terdiri dari 10 digit. Silakan periksa kembali dan inputkan CIF yang valid.',
      });
      return;
    }

    this.partyCifService
      .findLikeCifSegregasi(this.currentSearch, {
        page: 0,
        size: 9999,
        idPosition: this.getLocStor('POS'),
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          this.partyCifs = res.body;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail:
              'Saat ini CIF tidak ada pada system CASH. Silahkan find CIF Pada menu Initiation Debtor Data terlebih dahulu.',
          });
        }
      });
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  public create(): void {
    const dialogRef = this.dialog.open(CreditProposalNewDialogComponent, {
      width: '80vw',
      data: {
        partyCif: this.selection.selected[0],
      },
    });

    dialogRef.afterClosed().subscribe((res: IPartyCif) => {
      if (res && res.customerNumber) {
        if (res.customerType === 'PERSONAL') {
          this.creditProposalService.findPersonTemplate(res.customerNumber).subscribe(res2 => {
            console.log('res 2 person', res2);
            const creditProposal: ICreditProposal = res2.body;
            creditProposal.collaterals = res.collaterals;
            creditProposal.debtorData = res.debtorData;
            creditProposal.setCompliance = null;
            creditProposal.internalId = this.getLocStor('INT');

            this.creditProposalService.create(creditProposal, { idPosition: this.getLocStor('POS') }).subscribe(
              res3 => {
                if (res3.body) {
                  this.router.navigate([this.router.url.split('/')[1]]);
                }
              },
              error => {
                if (error.error.detail.includes('have an active credit proposal')) {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'Currently, credit proposal on behalf of CIF ' +
                      this.currentSearch +
                      ' is still on process (incomplete), please complete your current credit proposal process first.',
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.detail,
                  });
                }

                // Tindakan lain yang ingin Anda lakukan saat terjadi error dari backend
              }
            );
          });
        } else {
          this.creditProposalService.findPartyGroupTemplate(res.customerNumber).subscribe(res2 => {
            const creditProposal: ICreditProposal = res2.body;
            creditProposal.collaterals = res.collaterals;
            creditProposal.debtorData = res.debtorData;

            this.creditProposalService.create(creditProposal, { idPosition: this.getLocStor('POS') }).subscribe(
              res3 => {
                if (res3.body) {
                  this.router.navigate([this.router.url.split('/')[1]]);
                }
              },
              error => {
                if (error.error.detail.includes('have an active credit proposal')) {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'Currently, credit proposal on behalf of CIF ' +
                      this.currentSearch +
                      ' is still on process (incomplete), please complete your current credit proposal process first.',
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.detail,
                  });
                }
                // Tindakan lain yang ingin Anda lakukan saat terjadi error dari backend
              }
            );
          });
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan pada sistem, silahkan ulangi proses' });
      }
    });
  }
  public previousState(): void {
    window.history.back();
  }

  // CP/add new CP
  // cancel confrimation dialog
  public openCancelDialog(): void {
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
        this.previousState();
      }
    });
  }
}
