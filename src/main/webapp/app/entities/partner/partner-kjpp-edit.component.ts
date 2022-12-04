import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { IPartner, Partner } from './partner.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPerson } from '../person/person.model';

@Component({
  selector: 'jhi-partner-kjpp-edit',
  templateUrl: './partner-kjpp-edit.component.html',
  styleUrls: ['./partner-kjpp.css'],
})
export class PartnerKjppEditComponent extends AbstractEntityBaseViewComponent<IPartner> implements OnInit {
  public partner: IPartner;
  public partnerOrg: IPartyGroup;
  public partnerContact: IPerson;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;
  private id: string;

  post: any = '';
  organizationData: any = '';

  public isView = true;

  constructor(
    private partnerService: PartnerService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(partnerService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.item = new Partner();
    this.partnerService
      .find(this.id)
      .subscribe(result => {
        this.item = result.body;
        this.partner = this.item;
        this.partnerOrg = this.partner.organization;
        this.partnerContact = this.partner.contact;
      });
  }

  public submit() {
    this.partnerService.update(this.partner).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      if (res.body) {
        this.router.navigate(['/partner-kjpp']);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
