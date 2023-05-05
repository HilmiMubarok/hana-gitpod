import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MainFacilityService } from 'app/entities/main-facility/main-facility.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-main-facility-info',
  styleUrls: ['./main-facility-info.style.css'],
  templateUrl: './main-facility-info.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainFacilityInfoComponent implements OnInit {
  private _partyCif: IPartyCif;
  public dataMainFacility: IMainFacility[];
  public dataSendMainFacility: IMainFacility;

  @Input() // for internal purpose
  get partyCif() {
    return this._partyCif;
  }
  set partyCif(param: IPartyCif) {
    this._partyCif = param;
  }

  constructor(protected mainFacilityService: MainFacilityService) {}

  ngOnInit(): void {
    console.log('data party cif', this.partyCif);
    this.getData(this.partyCif.partyId);
  }

  columnsToDisplay = ['no', 'approvalNo', 'currency', 'mainPlafond', 'maturityDate', 'availableLimit'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  public getData(param: string) {
    this.mainFacilityService.getFacilities(param).subscribe(res => {
      this.dataMainFacility = res.body;
    });
  }

  public expanData(element: IMainFacility) {
    this.dataSendMainFacility = element;
  }
}
