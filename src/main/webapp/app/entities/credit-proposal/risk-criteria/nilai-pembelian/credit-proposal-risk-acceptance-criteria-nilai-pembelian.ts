import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { INilaiRac, NilaiRac } from './nilai-pembelian.model';

import { CreditProposalRacNilaiPembelianAddComponent } from './credrit-proposal-risk-acceptance-criteria-add';
import { CreditProposalRacNilaiPembelianEditComponent } from './credit-proposal-risk-acceptance-criteria-edit';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-nilai-pembelian',
  templateUrl: './credit-proposal-risk-acceptance-criteria-nilai-pembelian.html',
  styleUrls: ['./nilai-pembelian.css', '../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRacNilaiPembelianComponent {
  public loading: boolean;

  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: ICreditProposal) {
    this._item = item;
  }

  public displayColumns: string[] = ['no', 'NilaiPembelian', 'ccy', 'JenisJaminan', 'KeteranganJaminan', 'action'];

  public Ca: string;
  public creditApplication: object = ['Yes', 'No'];

  constructor(public dialog: MatDialog) {
    this.loading = false;
  }

  // Add View Dialog
  public openDialog(element: INilaiRac = null): void {
    const predicate = {
      width: '60vw',
      data: {
        item: this.item,
      },
    };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['lovBelow'] = element;
      predicate.data['view'] = true;
    } else {
      const nilaiRac: INilaiRac = new NilaiRac();
      nilaiRac.lovBelow = {};
      nilaiRac.lovBelow['nilaiPembelian'] = '';
      nilaiRac.lovBelow['ccy'] = '';
      nilaiRac.lovBelow['jenisJaminan'] = '';
      nilaiRac.lovBelow['keteranganJaminan'] = '';

      predicate.data['lovBelow'] = nilaiRac;
      predicate.data['view'] = false;
    }
    const dialogRef = this.dialog.open(CreditProposalRacNilaiPembelianAddComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.item.attributes['cpRacBelow']['lovBelow'] = [...this.item.attributes['cpRacBelow']['lovBelow'], res];
      }
    });
  }

  // EDIT View Dialog
  public editDialog(element: INilaiRac = null): void {
    const predicate = {
      width: '80vw',
      data: {
        item: this.item,
      },
    };
    predicate.data['edit'] = true;
    if (element) {
      predicate.data['lovBelow'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['lovBelow'] = new NilaiRac();
    }

    const dialogRef = this.dialog.open(CreditProposalRacNilaiPembelianEditComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const lovBelowsIndex: number = lodash.findIndex(this.item.attributes['lovBelow'], function (o: INilaiRac) {
        return o.id === res['cpRacBelow']['lovBelow'].id;
      });
      if (lovBelowsIndex > -1) {
        this.item.attributes['cpRacBelow']['lovBelow'][lovBelowsIndex] = res['cpRacBelow']['lovBelows'];
      } else {
        this.item.attributes['cpRacBelow']['lovBelow'] = [...this.item.attributes['cpRacBelow']['lovBelow'], res['cpRacBelow']['lovBelow']];
      }
    });
  }

  // DELETE

  public onDelete(element: ICreditProposal) {
    const dataGridNilai = this.item.attributes['cpRacBelow']['lovBelow'].filter(({ id }) => id !== element.id);
    this.item.attributes['cpRacBelow']['lovBelow'] = dataGridNilai;
    this.item.attributes['cpRacBelow']['lovBelow'] = dataGridNilai;
  }
}
