import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigAuthenticatedResult, OidcSecurityService } from 'angular-auth-oidc-client';

import { DataEventRecordsService } from '../dataeventrecords.service';
import { DataEventRecord } from '../models/DataEventRecord';

@Component({
  selector: 'app-dataeventrecords-edit',
  templateUrl: 'dataeventrecords-edit.component.html',
})
export class DataEventRecordsEditComponent implements OnInit {
  private id = 0;
  public message: string;
  public dataEventRecord: DataEventRecord = {
    id: 0,
    name: '',
    description: '',
    timestamp: '',
  };

  isAuthenticated$: Observable<boolean | ConfigAuthenticatedResult[]>;

  constructor(
    private dataEventRecordsService: DataEventRecordsService,
    public oidcSecurityService: OidcSecurityService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.message = 'DataEventRecords Edit';
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
  }

  ngOnInit() {
    this.isAuthenticated$.pipe(
      map((isAuthorized: boolean) => {
        console.log('isAuthorized: ' + isAuthorized);
      })
    );

    this.route.params.subscribe((params) => {
      const idToConvert = 'id';
      const id = +params[idToConvert]; // (+) converts string 'id' to a number
      this.id = id;
      if (this.dataEventRecord.id === 0) {
        this.dataEventRecordsService.GetById(id).subscribe(
          (data) => (this.dataEventRecord = data),
          () => console.log('DataEventRecordsEditComponent:Get by Id complete')
        );
      }
    });
  }

  Update() {
    this.dataEventRecordsService
      .Update(this.id, this.dataEventRecord)
      .subscribe(
        () => console.log('subscribed'),
        () => this.router.navigate(['/dataeventrecords'])
      );
  }
}
