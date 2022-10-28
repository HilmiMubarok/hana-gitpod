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
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';



@Component({
  selector: 'jhi-partner-kjpp-create',
  templateUrl: './partner-kjpp-create.component.html',
  styleUrls: ['./partner-kjpp.css'],
})

export class PartnerKjppCreateComponent extends AbstractEntityMaterialComponent<IPartner> implements OnInit {


  public partner: IPartner;
  formGroupPartner : FormGroup;
  formGroupPartnerOrganization : FormGroup;
  formGroupPartnerContact : FormGroup;

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
    this.createForm();
  }

  createForm() {
    this.formGroupPartner = this.formBuilder.group({
      'createdBy': '',
      'createdDate': '',
      'lastModifiedBy': '',
      'lastModifiedDate': '',
      'id': '',
      'statusId': '',
      'statusCode': '',
      'statusDescription': '',
      'roleId': '',
      'partyId': '',
      'name': '',
      'fromDate': '',
      'thruDate': '',
      'partnerId': '',
      'customer': true,
      'vendor': true,
      'paymentProvider': true,
      'surveyProvider': true,
      'internal': true,
      'organization': {},
      'contact': {},
      'identifications': [],
      'paymentPrefs': [],
      'addresses': []
    });

    this.formGroupPartnerOrganization = this.formBuilder.group({
      'createdBy': '',
      'createdDate': '',
      'lastModifiedBy': '',
      'lastModifiedDate': '',
      'id': '',
      'name': '',
      'partyTypeId': '',
      'groupName': '',
      'prefix': '',
      'afiks': '',
      'officePhone': '',
      'otherPhone1': '',
      'otherPhone2': '',
      'officeMail': '',
      'faxOffice': '',
      'taxIdNumber': '',
      'lineOfBussines': '',
      'postalCode': '',
      'companyType': ''
    });

    this.formGroupPartnerContact = this.formBuilder.group({
      'createdBy': '',
      'createdDate': '',
      'lastModifiedBy': '',
      'lastModifiedDate': '',
      'id': '',
      'name': '',
      'partyTypeId': '',
      'prefix': '',
      'firstName': '',
      'middleName': '',
      'aliasName': '',
      'lastName': '',
      'afiks': '',
      'pob': '',
      'dob': '',
      'bloodType': '',
      'gender': '',
      'maritalStatus': '',
      'citizenship': '',
      'personalIdNumber': '',
      'familyIdNumber': '',
      'taxIdNumber': '',
      'cellPhone1': '',
      'cellPhone2': '',
      'cellPhone3': '',
      'homePhone': '',
      'personalEmail': '',
      'mothersName': '',
      'notes': '',
      'religionTypeId': '',
      'religionTypeDescription': '',
      'workTypeId': '',
      'workTypeDescription': ''
    });
  }

  onSubmit(post) {
    // this.post = post;
    // console.log("isi 1", this.formGroupPartner.value);
    // console.log("isi 2", this.formGroupPartnerOrganization.value);
    // console.log("isi 3", this.formGroupPartnerContact.value);

    this.formGroupPartner.value.organization = this.formGroupPartnerOrganization.value;
    this.formGroupPartner.value.contact = this.formGroupPartnerContact.value;

    console.log("isi full", this.formGroupPartner.value);

    this.partnerService.create(this.formGroupPartner.value).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      console.log("hasil post", res);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
