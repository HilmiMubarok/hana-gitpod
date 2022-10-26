import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PositionService } from 'app/entities/position/position.service';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { OfferingLetterSignerPageDialogComponent } from './dialog/signer-page-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOfferingLetter, OfferingLetter } from '../offering-page.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-signer-page',
  templateUrl: './signer-page.component.html',
  styleUrls: ['../offering-page.css'],
})
export class OfferingLetterSignerPageComponent {
  // public offeringLetter: IOfferingLetter;
  private _creditProposal: ICreditProposal;
  private id: number;
  attributes: any;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  public displayColumns: string[] = ['no', 'name', 'debtor', 'action'];
  public loading: boolean;

  constructor(
    private positionService: PositionService,
    public dialog: MatDialog,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['offeringLetter'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.loading = false;
  }

  openDialog(element: IOfferingLetter = null): void {
    const predicate = {
      width: '80vw',
      data: {
        object: this.creditProposal,
      },
    };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['offeringLetter'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['offeringLetter'] = new OfferingLetter();
    }
    const dialogRef = this.dialog.open(OfferingLetterSignerPageDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.creditProposal.attributes['offeringLetter'] = [...this.creditProposal.attributes['offeringLetter'], res];
      }
    });
  }

  onEditDialog(element: IOfferingLetter = null): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['edit'] = true;
    if (element) {
      sessionStorage.setItem('debitorType', element.debitorType);
      predicate.data['offeringLetter'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['offeringLetter'] = new OfferingLetter();
    }

    const dialogRef = this.dialog.open(OfferingLetterSignerPageDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const offeringLetterIndex: number = lodash.findIndex(this.creditProposal.attributes['offeringLetter'], function (o: IOfferingLetter) {
        return o.id === res['offeringLetter'].id;
      });
      if (offeringLetterIndex > -1) {
        this.creditProposal.attributes['offeringLetter'][offeringLetterIndex] = res['offeringLetter'];
      } else {
        this.creditProposal.attributes['offeringLetter'] = [...this.creditProposal.attributes['offeringLetter'], res['offeringLetter']];
      }
    });
  }

  onDelete(element: IOfferingLetter = null): void {
    const dataGrid = this.creditProposal.attributes['offeringLetter'].filter(({ id }) => id !== element.id);
    this.creditProposal.attributes['offeringLetter'] = dataGrid;
    this.creditProposal.attributes['offeringLetter'] = dataGrid;
  }
}
