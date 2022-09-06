import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPerson, Person } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'jhi-collateral-appraisal-person-view',
  templateUrl: './collateral-appraisal-person-view.component.html',
  styleUrls: ['./collateral-appraisal-person-view.css'],
})
export class CollateralAppraisalPersonViewComponent implements OnChanges {
  @Input()
  public id: string;

  public tipeNasabah: string;
  public item: IPerson;
  constructor(private personService: PersonService) {
    this.tipeNasabah = 'individu';
    this.item = new Person();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.personService.find(this.id).subscribe(res => {
      this.item = res.body;
    });
  }
}
