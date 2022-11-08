import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import lodash from 'lodash';
import { CreditProposal, ICreditProposal } from '../../credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-assign-to',
  templateUrl: './assign-to.component.html',
})
export class AssignToComponent implements OnInit {
  constructor(private positionService: PositionService, public applicationRoleService: ApplicationRoleService) {
    this.applicationRole = new ApplicationRole();
  }

  public applicationRoleId;
  public applicationRole;
  public position: IPosition[];
  public _creditProposal: ICreditProposal = new CreditProposal();

  ngOnInit(): void {
    // if proposal state == "something" => load position CRO, else load other position
    this.loadPosition('CRO');
  }

  // send applicationRole data to parent
  @Output() assignTo = new EventEmitter();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: any) {
    this._creditProposal = item;
  }

  public loadPosition(position): void {
    this.positionService.queryFilterBy({ idPositionType: position, size: 9999, page: 0 }).subscribe(res => {
      this.position = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.applicationRoleService.find(this.creditProposal.id).subscribe(resApplicationRole => {
        if (resApplicationRole) {
          this.applicationRole = resApplicationRole.body;
          for (let i = 0; i < this.position.length; i++) {
            if (this.applicationRole.partyId === this.position[i].partyId) {
              this.applicationRoleId = this.position[i].id;
            }
          }
        }
      });
    });
  }

  public onSelectAssignTo(event: any) {
    for (let i = 0; i < this.position.length; i++) {
      if (event.value === this.position[i].id) {
        this.applicationRole.partyId = this.position[i].partyId;
        this.applicationRole.partyName = this.position[i].employeeFirstName;
        this.applicationRole.roleId = this.position[i].positionTypeId;
        this.applicationRole.roleDescription = this.position[i].positionTypeDescription;
      }
    }
    // send applicationRole data to parent
    this.assignTo.emit(this.applicationRole);
  }
}
