import { Component, ViewChild, ElementRef } from '@angular/core';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs, RemoveEventArgs, TaggingEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
@Component({
  selector: 'jhi-credit-proposal-list',
  templateUrl: './credit-proposal-list.component.html',
  styleUrls: ['./credit-proposal-list.css'],
})
export class CreditProposalListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  @ViewChild('searchTextBox') public searchTextBox: TextBoxComponent;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // The Dialog shows within the target element.
  @ViewChild('container', { read: ElementRef, static: false }) container: ElementRef;
  // The Dialog shows within the target element.

  public filterData: { [key: string]: Object }[];
  public filterFields: Object = { text: 'filterText', value: 'id' };
  public filterPlaceholder = 'Select Filter';
  public box = 'Box';

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
    this.entityKeyName = 'id';
    this.predicate = 'id';
  }

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query = new Query();
    query = e.text !== '' ? query.where('filterText', 'contains', e.text, true) : query;
    e.updateData(this.filterData, query);
  };

  public initilaizeTarget: EmitType<object> = () => {};

  public onTagging(e: TaggingEventArgs) {
    console.log('e @onTagging : ', e);
  }

  public onRemoved(e: RemoveEventArgs) {
    console.log('e @onRemoved : ', e);
  }

  public onCreateSearchTextBox() {
    this.searchTextBox.addIcon('append', 'e-icons e-search');
  }

  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
  }

  public previousState(): void {
    window.history.back();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  public goToAdd(): void {
    this.ejDialog.show();
    this.initilaizeTarget();
  }
}
