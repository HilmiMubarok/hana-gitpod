import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { ColumnModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-slik-summary',
  templateUrl: './credit-proposal-slik-summary-list.component.html',
  styleUrls: ['./css/slik-sumarry.css'],
})
export class CreditProposalListSlikSummaryListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  @ViewChild('ejDialog')
  ejDialog: DialogComponent;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };

  onOpen(args: any) {
    args.preventFocus = true;
  }

  public onOpenDialog(): void {
    this.ejDialog.show();
  }

  public onOverlayClick(): void {
    this.ejDialog.hide();
  }

  public onBeforeOpen = function (args: any): void {
    args.maxHeight = '750px';
  };

  public data: any = [
    {
      indexNum: 1,
      name: 'Testing',
      bank: 'John',
      limit: 'Manager',
      os: 'android',
      facilityType: 'tes',
      rate: '6 %',
      period: '2022',
      type: 'tes',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },

    {
      indexNum: 2,
      name: 'Jay',
      bank: 'Hanna Bank',
      limit: 'Rp. 300.000.000.000',
      os: 'android',
      facilityType: 'Platinum',
      rate: '10 %',
      period: '2022',
      type: 'blabla',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
    {
      indexNum: 3,
      name: 'Jay',
      bank: 'Hanna Bank',
      limit: 'Rp. 300.000.000.000',
      os: 'android',
      facilityType: 'Platinum',
      rate: '10 %',
      period: '2022',
      type: 'blabla',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
    {
      indexNum: 4,
      name: 'Jay',
      bank: 'Hanna Bank',
      limit: 'Rp. 300.000.000.000',
      os: 'android',
      facilityType: 'Platinum',
      rate: '10 %',
      period: '2022',
      type: 'blabla',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
    {
      indexNum: 5,
      name: 'Jay',
      bank: 'Hanna Bank',
      limit: 'Rp. 300.000.000.000',
      os: 'android',
      facilityType: 'Platinum',
      rate: '10 %',
      period: '2022',
      type: 'blabla',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
    {
      indexNum: 6,
      name: 'Jay',
      bank: 'Hanna Bank',
      limit: 'Rp. 300.000.000.000',
      os: 'android',
      facilityType: 'Platinum',
      rate: '10 %',
      period: '2022',
      type: 'blabla',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
  ];

  public collateralColumns: ColumnModel[] = [
    {
      field: 'type',
      headerText: 'Type',
      width: 200,
      textAlign: 'Left',
      headerTextAlign: 'Center',
    },
    {
      field: 'idrMio',
      headerText: 'IDR Mio',

      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public comparison: any = [
    {
      number: 1,
      bank: 'BCA',
      limitPrev: 'Rp. 50.000.000',
      balancePrev: 'Rp. 100.000.000',
      limitCur: 'Rp. 55.000.000',
      balanceCur: 'Rp. 110.000.000',
    },
  ];

  public previous: ColumnModel[] = [
    {
      field: 'limitPrev',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balancePrev',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public current: ColumnModel[] = [
    {
      field: 'limitCur',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balanceCur',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];
}
