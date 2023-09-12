import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { BookModel } from '../../models/book.model';
import { BookEmitter } from '../../interfaces/book-emitter.interface';
import { EmitterType } from '../../enums/emitter-type.enum';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit, OnChanges {
  @Input() book!: BookModel | null;
  @Input() loading = false;
  @Output() eventEmitter = new EventEmitter<BookEmitter>();

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective;

  private initialFormValue: unknown;

  protected form!: FormGroup;

  ngOnInit(): void {
    this.#creatForm();
    this.initialFormValue = this.form.value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.book != null) {
      this.form.patchValue({
        id: this.book.id,
        name: this.book.name,
        author: this.book.author,
        quantity: this.book.quantity.toString(),
        amount: this.book.amount.toFixed(2).toString(),
        description: this.book.description,
      });
    }
  }

  #creatForm() {
    this.form = new FormGroup({
      id: new FormControl(0, Validators.required),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      author: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.maxLength(8),
      ]),
      quantity: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
    });
  }

  onReset(e: Event) {
    e.preventDefault();
    this.book = null;
    this.formDir.resetForm(this.initialFormValue);
  }

  onSave() {
    const data: BookEmitter = {
      book: this.form.getRawValue(),
      emitterType: EmitterType.SAVE,
    };

    this.formDir.resetForm(this.initialFormValue);
    this.eventEmitter.emit(data);
  }
}
