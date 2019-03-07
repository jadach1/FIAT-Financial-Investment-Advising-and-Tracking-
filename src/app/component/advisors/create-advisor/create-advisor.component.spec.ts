import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvisorComponent } from './create-advisor.component';

describe('CreateAdvisorComponent', () => {
  let component: CreateAdvisorComponent;
  let fixture: ComponentFixture<CreateAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
