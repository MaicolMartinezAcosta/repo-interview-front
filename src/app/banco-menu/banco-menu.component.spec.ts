import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoMenuComponent } from './banco-menu.component';
import 'jest-preset-angular/setup-jest';

describe('BancoMenuComponent', () => {
  let component: BancoMenuComponent;
  let fixture: ComponentFixture<BancoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BancoMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BancoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
