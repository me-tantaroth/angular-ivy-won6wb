import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionThreeComponent } from './option-three.component';

describe('OptionThreeComponent', () => {
  let component: OptionThreeComponent;
  let fixture: ComponentFixture<OptionThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
