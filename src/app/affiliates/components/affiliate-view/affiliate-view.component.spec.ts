import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateViewComponent } from './affiliate-view.component';

describe('AffiliateViewComponent', () => {
  let component: AffiliateViewComponent;
  let fixture: ComponentFixture<AffiliateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffiliateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
