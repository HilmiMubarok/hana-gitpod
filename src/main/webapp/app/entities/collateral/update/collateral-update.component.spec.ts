import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CollateralService } from '../service/collateral.service';
import { ICollateral, Collateral } from '../collateral.model';

import { CollateralUpdateComponent } from './collateral-update.component';

describe('Collateral Management Update Component', () => {
  let comp: CollateralUpdateComponent;
  let fixture: ComponentFixture<CollateralUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let collateralService: CollateralService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CollateralUpdateComponent],
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
      .overrideTemplate(CollateralUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CollateralUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    collateralService = TestBed.inject(CollateralService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const collateral: ICollateral = { id: 456 };

      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(collateral));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = { id: 123 };
      jest.spyOn(collateralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collateral }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(collateralService.update).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = new Collateral();
      jest.spyOn(collateralService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: collateral }));
      saveSubject.complete();

      // THEN
      expect(collateralService.create).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Collateral>>();
      const collateral = { id: 123 };
      jest.spyOn(collateralService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ collateral });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(collateralService.update).toHaveBeenCalledWith(collateral);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
