import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordInputComponent } from './new-password-input.component';

describe('NewPasswordInputComponent', () => {
  let component: NewPasswordInputComponent;
  let fixture: ComponentFixture<NewPasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPasswordInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
