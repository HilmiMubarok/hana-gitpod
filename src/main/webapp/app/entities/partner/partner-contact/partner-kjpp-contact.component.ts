import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrganizationCustomer, OrganizationCustomer } from 'app/entities/organization-customer/organization-customer.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPartyType } from 'app/entities/party-type/party-type.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { OrganizationCustomerService } from 'app/entities/organization-customer/organization-customer.service';
import { IPerson } from 'app/entities/person/person.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPartner } from '../partner.model';

@Component({
  selector: 'jhi-partner-contact-kjpp',
  templateUrl: './partner-kjpp-contact.component.html',
  styleUrls: ['../partner-kjpp.css'],
})
export class PartnerKjppContactComponent extends AbstractEntityMaterialComponent<IPerson> implements OnInit {
  private _contact: IPerson;
  partyTypeId: string;
  partytypes: IPartyType[] = [];
  maritalstatus: string[] = ['Single', 'Married', 'Widowed', 'Divorced'];
  bloodType: string[] = ['A', 'B', 'AB', 'O'];

  post: any = '';

  private _partner: IPartner;

  public _isView: false;

  @Input()
  get partnerContact() {
    return this._contact;
  }

  set partnerContact(data: IPerson) {
    this._contact = data;
  }

  @Input()
  get isView() {
    return this._isView;
  }

  set isView(data) {
    this._isView = data;
  }

  constructor(
    private organizationService: OrganizationCustomerService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, organizationService);
  }

  // @Input()
  // parentForm: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {}

  onSubmit(post) {
    // this.post = post;
    console.log('isi', post);
  }

  previousState(): void {
    window.history.back();
  }
}
