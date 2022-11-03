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
import { IPartyGroup } from 'app/entities/party-group/party-group.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPartner } from '../partner.model';

@Component({
  selector: 'jhi-partner-organization-kjpp',
  templateUrl: './partner-kjpp-organization.component.html',
  styleUrls: ['../partner-kjpp.css'],
})
export class PartnerKjppOrganizationComponent extends AbstractEntityMaterialComponent<IPartyGroup> implements OnInit {
  private _organization: IPartyGroup;
  partyTypeId: string;
  post: any = '';

  pickedPartyType: string;
  partyTypeIds: Object[] = [
    { value: 'PERSON', desc: 'Person' },
    { value: 'PARTY_GROUP', desc: 'Organization' },
  ];

  private _partner: IPartner;

  public _isView: false;

  @Input()
  get partnerOrganization() {
    return this._organization;
  }

  set partnerOrganization(data: IPartyGroup) {
    this._organization = data;
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

  onSubmit(post) {}

  previousState(): void {
    window.history.back();
  }
}
