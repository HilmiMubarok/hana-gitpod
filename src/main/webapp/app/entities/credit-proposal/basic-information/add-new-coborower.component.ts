import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Cif, ICif } from '../../cif/cif.model';
import { CollateralAppraisal, ICollateralAppraisal } from '../../collateral-appraisal/collateral-appraisal.model';

import { IPartyCif } from '../../party-cif/party-cif.model';
import { PartyCifService } from '../..//party-cif/party-cif.service';

import { CreditProposalService } from '../credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-coborower',
  templateUrl: './add-new-coborower.component.html',
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
export class AddCoborowerComponent {
  @Output() Emiter = new EventEmitter<any[]>();
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
    this.currentSearch = '';
    this.Emiter.emit(this.selection.selected);
  }
}
