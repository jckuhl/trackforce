import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociateViewComponent} from './associate-view.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthenticationService} from '../../services/authentication-service/authentication.service';
import {AssociateService} from '../../services/associate-service/associate.service';
import {ActivatedRoute} from '@angular/router';
import {RequestService} from '../../services/request-service/request.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {NO_ERRORS_SCHEMA} from '@angular/core';
// added imports; DK
import { ClientService } from '../../services/client-service/client.service';
import { Associate } from '../../models/associate.model';
import { Batch } from '../../models/batch.model';
import { Client } from '../../models/client.model';
import { EndClient } from '../../models/end-client.model';
import { User } from '../../models/user.model';
import { MarketingStatus } from '../../models/marketing-status.model';

export class MockActivatedRoute {
  static createMockRoute(tid: number): any {
    return {
      params: Observable.of({id: tid}),
      snapshot: {
        parent: {
          params: {
            id: 1
          }
        },
        paramMap: {
          get(name: string): string {
            return '' + tid;
          }
        }
      },
    };
  }
}

export class MockAuthenticationService extends AuthenticationService {
  getAssociate(): Associate {
    let mockBatch:Batch = new Batch();
    mockBatch.id = 100;
    mockBatch.batchName = 'mockBatchName';
    
    let batches:Batch[] = [mockBatch];

    let client:Client = new Client();
    client.name = 'client';

    let endClient:EndClient = new EndClient();
    endClient.name = 'none';

    const user:User = new User('newUser','pass', 0, 0);
    const marketingStatus:MarketingStatus = new MarketingStatus(1, 'status');

    const associate:Associate = new Associate('first', 'last', user);
    
    // Add objects to associate
    associate.marketingStatus = marketingStatus;
    associate.batch = mockBatch;
    associate.client = client;
    associate.endClient = endClient;

    return associate;
  }
}

export class MockAssociateService extends AssociateService {
  getAssociate(id: number) {
    const user:User = new User('newUser','pass', 0, 0);
    const associate:Associate = new Associate('first', 'last', user);
    return Observable.of(associate);
  }
}

describe('AssociateViewComponent', () => {
  const mockAssociateService: AssociateService = new AssociateService(null);
  const mockAuthService: AuthenticationService = new AuthenticationService(null, null, null);
  let component: AssociateViewComponent = new AssociateViewComponent(mockAssociateService, mockAuthService, null, null);
  let fixture: ComponentFixture<AssociateViewComponent>;
  let clients: Array<any> = [];

  beforeAll(() => {
  
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssociateViewComponent
      ],
      providers: [
        AuthenticationService,
        RequestService,
        AssociateService,
        ClientService,
        {provide: ActivatedRoute, useValue: MockActivatedRoute.createMockRoute(1)}
      ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    const mockUser: User = new User('mockuser', 'mockPassword', 1, 0);
    const mockAssociate = new Associate('firstName', 'lastName', mockUser);
    const mockAssociates: Associate[] = [mockAssociate];
    
    // spyOn(mockAssociateService, 'getAllAssociates').and.returnValue(Observable.of(mockAssociates));
    // spyOn(mockAssociateService, 'getAssociate').and.returnValue(mockAssociate);
    // spyOn(mockAuthService, 'getAssociate').and.returnValue(mockAssociate);
    // spyOn(mockAssociateService, 'updateAssociate').and.returnValue(mockAssociate);

    fixture = TestBed.overrideComponent(AssociateViewComponent,
    {set: {providers: [{provide: AssociateService, useClass: MockAssociateService},
                       {provide: AuthenticationService, useClass: MockAuthenticationService}]}}).createComponent(AssociateViewComponent);  
                       component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an associate', () => {
    expect(component.associate).toBeTruthy();
  });

  // it('getAssociate() should return the specified associate', () => {
  //   expect(component.getAssociate(900)).toContain("Cameron");
  //   expect(component.getAssociate(90000)).toContain(null);
  // });

  // it('getClient() should return a list of clients', () => {
  //   component.getClients();
  //   expect(clients.length).toBeGreaterThanOrEqual(0);
  //   expect(clients.toString).toContain("Ciox Health");
  // });
});
