import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-tab-exposure',
  templateUrl: './credit-proposal-tab-exposure.component.html',
  styleUrls: ['../layout-css/layout-css-template.css'],
})
export class CreditProposalTabExposureComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  private _person: ICreditProposal[];
  public data: any = [];

  // public init = 0;
  // public init2 = 0;
  // public change = 0;
  // public os = 0;
  // public credit = 0;
  // public avilable = 0;
  // public totallimt = 0;
  // public totalos = 0;
  // public totalchange = 0;
  // public totalcredit = 0;
  // public totalavilable = 0;
  // public change2 = 0;

  constructor(
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
  }
  initialize() {
    this.getPerson();
    // this.fungsiSuminit();
    // this.fungsiSuminit2();
    // this.fungsiSumchange();
    // this.fungsiSumOS();
    // this.fungsiSumcredit();
    // this.fungsiSumavilable();
    // this.fungsiSumTotallimit();
    // this.fungsiSumTotaltotalchange();
    // this.fungsiSumTotaltotalcredit();
    // this.fungsiSumTotaltotalos();
  }
  getPerson(): void {
    this.creditProposalService.loadCacheAll().subscribe((res: ICreditProposal[]) => {
      this._person = res || [];
      this.setData();
    });
  }

  setData() {
    this._person.map(item => {
      this.data = [
        ...this.data,
        {
          name: item.prospectPerson.name,
        },
      ];
    });
  }

  // public data = [
  //   {
  //     indexNum: 1,
  //     applicationNumber: 'data',
  //     cifnumber: 79,
  //     InitialLimit: 1000,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     OS: 1000,
  //     credit: 100,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data1',
  //     namegroup: 'michael',
  //   },
  //   {
  //     indexNum: 2,
  //     applicationNumber: 'data2',
  //     cifnumber: 70,
  //     InitialLimit: 3500,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data2',
  //     namegroup: 'hartono',
  //   },
  //   {
  //     indexNum: 3,
  //     applicationNumber: 'data3',
  //     cifnumber: 79,
  //     InitialLimit: 1500,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data3',
  //     namegroup: 'obet',
  //   },
  //   {
  //     indexNum: 4,
  //     applicationNumber: 'data4',
  //     cifnumber: 79,
  //     InitialLimit: 2000,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data4',
  //     namegroup: 'abet',
  //   },
  //   {
  //     indexNum: 5,
  //     applicationNumber: 'data5',
  //     cifnumber: 79,
  //     InitialLimit: 2500,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data5',
  //     namegroup: 'helmi',
  //   },
  //   {
  //     indexNum: 6,
  //     applicationNumber: 'data6',
  //     cifnumber: 79,
  //     InitialLimit: 4300,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data6',
  //     namegroup: 'andi',
  //   },
  //   {
  //     indexNum: 7,
  //     applicationNumber: 'data7',
  //     cifnumber: 79,
  //     InitialLimit: 1200,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data7',
  //     namegroup: 'randi',
  //   },
  //   {
  //     indexNum: 8,
  //     applicationNumber: 'data8',
  //     cifnumber: 79,
  //     InitialLimit: 1800,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data8',
  //     namegroup: 'inan',
  //   },
  //   {
  //     indexNum: 9,
  //     applicationNumber: 'data9',
  //     cifnumber: 79,
  //     InitialLimit: 1500,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     Change2: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'coba',
  //     namegroup: 'setya',
  //   },
  //   {
  //     indexNum: 10,
  //     applicationNumber: 'data10',
  //     cifnumber: 79,
  //     InitialLimit: 1600,
  //     InitialLimit2: 1600,
  //     Change: 1500,
  //     OS: 1000,
  //     OS2: 1000,
  //     credit: 1000,
  //     credit2: 1000,
  //     interet: '2022',
  //     Providion: '1000',
  //     admin: '1000',
  //     frist: '1000',
  //     Maturity: 'data10',
  //     namegroup: 'anjar',
  //   },
  // ];

  // fungsiSuminit() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.init = this.init + this.data[i].InitialLimit;
  //   }
  // }
  // fungsiSumchange() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.change = this.change + this.data[i].Change;
  //   }
  // }
  // fungsiSumOS() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.os = this.os + this.data[i].OS;
  //   }
  // }
  // fungsiSumcredit() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.credit = this.credit + this.data[i].credit;
  //   }
  // }
  // fungsiSumavilable() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.avilable = this.avilable + this.data[i].cifnumber;
  //   }
  // }
  // fungsiSuminit2() {
  //   for (let i = 0; i < this.data.length; i++) {
  //     this.init2 = this.init2 + this.data[i].InitialLimit2;
  //   }
  // }
  // fungsiSumTotallimit() {
  //   this.totallimt = this.init + this.init2;
  // }
  // fungsiSumTotaltotalchange() {
  //   this.totalchange = this.change + this.change;
  // }
  // fungsiSumTotaltotalcredit() {
  //   this.totalcredit = this.credit + this.credit;
  // }
  // fungsiSumTotaltotalos() {
  //   this.totalos = this.os + this.os;
  // }
  // public findCif(): void {
  //   this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
  //     const result: ICreditProposal = res.body;
  //     if (result) {
  //       const redirectUri = '/credit-proposal/' + result[0].id + '/edit';
  //       this.router.navigate([redirectUri]);
  //     }
  //   });
  // }
}
