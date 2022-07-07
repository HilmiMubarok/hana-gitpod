import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { IPartySlik } from './party-slik.model';
import { PartySlikService } from './party-slik.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityAsListComponent } from 'app/shared/base/abstract-entity-as-list.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-party-slik-as-list',
  templateUrl: './party-slik-as-list.component.html',
})
export class PartySlikAsListComponent extends AbstractEntityAsListComponent<IPartySlik> implements OnChanges {
  @Input() filterName: string;
  @Input() idParty: any;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;

  constructor(
    protected partySlikService: PartySlikService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService
  ) {
    super(
      partySlikService,
      parseLinks,
      alertService,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.listChangeEventName = 'partySlikListModification';
    this.entityKeyName = 'id';
    this.predicate = 'id';
  }

  protected loadAllFilterBy() {
    const queryParams: any = { page: this.page - 1, size: this.itemsPerPage, sort: this.sort() };
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idParty) {
      queryParams.idParty = this.idParty;
    }
    this.partySlikService.queryFilterBy(queryParams).subscribe(
      (res: HttpResponse<IPartySlik[]>) => this.paginateItems(res.body, res.headers),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idParty']) {
      this.loadAll();
    }
  }

  trackId(index: number, item: IPartySlik) {
    return item.id;
  }

  get partySliks() {
    return this.items;
  }

  set partySliks(partySlik: IPartySlik[]) {
    this.items = partySlik;
  }

  addNewData() {
    const queryParams: any = {};
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idParty) {
      queryParams.partyId = this.idParty;
    }
    this.router.navigate(['party-slik/new', queryParams]);
  }

  onEditComplete(event: any) {
    this.partySlikService.update(event.data).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Data Updated', detail: 'Data updated...' });
      this.eventManager.broadcast({
        name: this.listChangeEventName,
        content: 'Completed an item',
      });
    });
  }

  onUploadFile(event: any) {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      const formData: FormData = new FormData();
      formData.append('file', files[0], files[0].name);
      this.itemService.uploadFile(formData, null).subscribe(res => {
        this.inputFile.nativeElement.value = null;
        this.itemService.process({ fileName: res.body.fileName }, { processName: 'processUploadFile' }).subscribe(() => {
          this.messageService.add({ severity: 'info', summary: 'Upload Done', detail: 'Upload ' + res.body.fileName + ' done process' });
        });
      });
    }
  }
}
