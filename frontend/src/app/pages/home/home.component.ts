import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  search = '';
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products. Is the backend running?';
        this.loading = false;
      }
    });
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    );
  }
}
