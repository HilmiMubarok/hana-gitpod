import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PartyGroupDetailComponent } from './party-group-detail.component';

describe('PartyGroup Management Detail Component', () => {
  let comp: PartyGroupDetailComponent;
  let fixture: ComponentFixture<PartyGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ partyGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PartyGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PartyGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load partyGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.partyGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
