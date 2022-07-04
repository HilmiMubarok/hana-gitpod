import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PartyPostalAddressService } from '../service/party-postal-address.service';
import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address.model';

import { PartyPostalAddressUpdateComponent } from './party-postal-address-update.component';

describe('PartyPostalAddress Management Update Component', () => {
  let comp: PartyPostalAddressUpdateComponent;
  let fixture: ComponentFixture<PartyPostalAddressUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partyPostalAddressService: PartyPostalAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PartyPostalAddressUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PartyPostalAddressUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartyPostalAddressUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partyPostalAddressService = TestBed.inject(PartyPostalAddressService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const partyPostalAddress: IPartyPostalAddress = { id: 456 };

      activatedRoute.data = of({ partyPostalAddress });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(partyPostalAddress));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyPostalAddress>>();
      const partyPostalAddress = { id: 123 };
      jest.spyOn(partyPostalAddressService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyPostalAddress });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partyPostalAddress }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(partyPostalAddressService.update).toHaveBeenCalledWith(partyPostalAddress);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyPostalAddress>>();
      const partyPostalAddress = new PartyPostalAddress();
      jest.spyOn(partyPostalAddressService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyPostalAddress });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partyPostalAddress }));
      saveSubject.complete();

      // THEN
      expect(partyPostalAddressService.create).toHaveBeenCalledWith(partyPostalAddress);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyPostalAddress>>();
      const partyPostalAddress = { id: 123 };
      jest.spyOn(partyPostalAddressService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyPostalAddress });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partyPostalAddressService.update).toHaveBeenCalledWith(partyPostalAddress);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
