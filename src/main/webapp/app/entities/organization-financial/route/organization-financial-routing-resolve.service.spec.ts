import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial.model';
import { OrganizationFinancialService } from '../service/organization-financial.service';

import { OrganizationFinancialRoutingResolveService } from './organization-financial-routing-resolve.service';

describe('OrganizationFinancial routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganizationFinancialRoutingResolveService;
  let service: OrganizationFinancialService;
  let resultOrganizationFinancial: IOrganizationFinancial | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(OrganizationFinancialRoutingResolveService);
    service = TestBed.inject(OrganizationFinancialService);
    resultOrganizationFinancial = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganizationFinancial returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationFinancial = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationFinancial).toEqual({ id: 123 });
    });

    it('should return new IOrganizationFinancial if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationFinancial = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganizationFinancial).toEqual(new OrganizationFinancial());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganizationFinancial })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationFinancial = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationFinancial).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
