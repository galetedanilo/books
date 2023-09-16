import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-books-total',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './books-total.component.html',
  styleUrls: ['./books-total.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksTotalComponent {
  @Input() total!: number | null;
  @Output() addBook = new EventEmitter<void>();
}
