import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOrganizationManagement, OrganizationManagement } from '../organization-management.model';
import { OrganizationManagementService } from '../service/organization-management.service';

import { OrganizationManagementRoutingResolveService } from './organization-management-routing-resolve.service';

describe('OrganizationManagement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OrganizationManagementRoutingResolveService;
  let service: OrganizationManagementService;
  let resultOrganizationManagement: IOrganizationManagement | undefined;

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
    routingResolveService = TestBed.inject(OrganizationManagementRoutingResolveService);
    service = TestBed.inject(OrganizationManagementService);
    resultOrganizationManagement = undefined;
  });

  describe('resolve', () => {
    it('should return IOrganizationManagement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationManagement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationManagement).toEqual({ id: 123 });
    });

    it('should return new IOrganizationManagement if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationManagement = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOrganizationManagement).toEqual(new OrganizationManagement());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OrganizationManagement })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOrganizationManagement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOrganizationManagement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
