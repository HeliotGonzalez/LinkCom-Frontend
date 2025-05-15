import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/components/input/input.component.spec.ts
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputComponent);
========
import { CommentModalComponent } from './comment-modal.component';

describe('CommentModalComponent', () => {
  let component: CommentModalComponent;
  let fixture: ComponentFixture<CommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentModalComponent);
>>>>>>>> d89c3e6003064a9d5f07d12c4c391a4451e01c5f:src/app/components/comment-modal/comment-modal.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
