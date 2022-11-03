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

@Component({
  selector: 'jhi-partner-kjpp-create',
  templateUrl: './partner-kjpp-create.component.html',
  styleUrls: ['./partner-kjpp.css'],
})
export class PartnerKjppCreateComponent extends AbstractEntityMaterialComponent<IPartner> implements OnInit {
  public partner: IPartner;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;

  post: any = '';
  organizationData: any = '';

  constructor(
    private partnerService: PartnerService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, partnerService);
  }

  ngOnInit(): void {
    this.partner = new Partner();
    console.log('apa ini', this.partner);
  }

  submit() {
    // this.formGroupPartner.value.organization = this.formGroupPartnerOrganization.value;
    // this.formGroupPartner.value.contact = this.formGroupPartnerContact.value;

    // console.log("isi full", this.formGroupPartner.value);

    console.log('filledPartner', this.partner);
    this.partnerService.create(this.partner).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      console.log('hasil post', res);

      if (res.body) {
        this.router.navigate(['/partner-kjpp']);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
}
