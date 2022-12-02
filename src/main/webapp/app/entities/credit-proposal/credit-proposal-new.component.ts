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

@Component({
  selector: 'jhi-credit-proposal-new',
  templateUrl: './credit-proposal-new.component.html',
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
  constructor(
    private creditProposalService: CreditProposalService,
    private partyCifService: PartyCifService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.partyCifs = [];
  }

  public search(): void {
    this.partyCifService
      .findLikeCif(this.currentSearch, {
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.partyCifs = res.body;
      });
  }

  public create(): void {
    const dialogRef = this.dialog.open(CreditProposalNewDialogComponent, {
      width: '80vw',
      data: {
        partyCif: this.selection.selected[0],
      },
    });

    dialogRef.afterClosed().subscribe((res: IPartyCif) => {
      if (res.customerType === 'PERSONAL') {
        this.creditProposalService.findPersonTemplate(res.customerNumber).subscribe(res2 => {
          const creditProposal: ICreditProposal = res2.body;
          creditProposal.collaterals = res.collaterals;
          creditProposal.debtorData = res.debtorData;
          creditProposal.setCompliance = null;

          this.creditProposalService.create(creditProposal, {}).subscribe(res3 => {
            if (res3.body) {
              this.router.navigate([this.router.url.split('/')[1]]);
            }
          });
        });
      } else {
        this.creditProposalService.findPartyGroupTemplate(res.customerNumber).subscribe(res2 => {
          const creditProposal: ICreditProposal = res2.body;
          creditProposal.collaterals = res.collaterals;
          creditProposal.debtorData = res.debtorData;

          this.creditProposalService.create(creditProposal, {}).subscribe(res3 => {
            if (res3.body) {
              this.router.navigate([this.router.url.split('/')[1]]);
            }
          });
        });
      }
    });
  }
}
