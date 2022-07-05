import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PartyGroupService } from '../service/party-group.service';
import { IPartyGroup, PartyGroup } from '../party-group.model';

import { PartyGroupUpdateComponent } from './party-group-update.component';

describe('PartyGroup Management Update Component', () => {
  let comp: PartyGroupUpdateComponent;
  let fixture: ComponentFixture<PartyGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partyGroupService: PartyGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PartyGroupUpdateComponent],
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
      .overrideTemplate(PartyGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartyGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partyGroupService = TestBed.inject(PartyGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const partyGroup: IPartyGroup = { id: 456 };

      activatedRoute.data = of({ partyGroup });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(partyGroup));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyGroup>>();
      const partyGroup = { id: 123 };
      jest.spyOn(partyGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partyGroup }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(partyGroupService.update).toHaveBeenCalledWith(partyGroup);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyGroup>>();
      const partyGroup = new PartyGroup();
      jest.spyOn(partyGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partyGroup }));
      saveSubject.complete();

      // THEN
      expect(partyGroupService.create).toHaveBeenCalledWith(partyGroup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PartyGroup>>();
      const partyGroup = { id: 123 };
      jest.spyOn(partyGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partyGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partyGroupService.update).toHaveBeenCalledWith(partyGroup);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
