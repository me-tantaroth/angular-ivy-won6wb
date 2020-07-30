import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendindDataComponent } from './pendind-data.component';

describe('PendindDataComponent', () => {
  let component: PendindDataComponent;
  let fixture: ComponentFixture<PendindDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendindDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendindDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
