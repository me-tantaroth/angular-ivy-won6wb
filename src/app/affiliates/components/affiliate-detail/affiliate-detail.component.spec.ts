import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateDetailComponent } from './affiliate-detail.component';

describe('AffiliateDetailComponent', () => {
  let component: AffiliateDetailComponent;
  let fixture: ComponentFixture<AffiliateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
