import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PartyPostalAddressDetailComponent } from './party-postal-address-detail.component';

describe('PartyPostalAddress Management Detail Component', () => {
  let comp: PartyPostalAddressDetailComponent;
  let fixture: ComponentFixture<PartyPostalAddressDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyPostalAddressDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ partyPostalAddress: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PartyPostalAddressDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PartyPostalAddressDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load partyPostalAddress on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.partyPostalAddress).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
