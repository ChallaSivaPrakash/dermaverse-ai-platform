import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  success = '';

  // Add form
  newProduct = { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' };
  addLoading = false;

  // Edit
  editingId: string | null = null;
  editProduct = { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.api.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.error = 'Failed to load products.'; this.loading = false; }
    });
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      this.error = 'Name and price are required.';
      return;
    }
    this.addLoading = true;
    this.error = '';
    this.api.createProduct(this.newProduct).subscribe({
      next: (p) => {
        this.products.unshift(p);
        this.newProduct = { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' };
        this.success = 'Product created!';
        this.addLoading = false;
        setTimeout(() => this.success = '', 2000);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to create product.';
        this.addLoading = false;
      }
    });
  }

  startEdit(p: Product) {
    this.editingId = p.id;
    this.editProduct = {
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      stock: p.stock,
      category: p.category ?? '',
      image_url: p.image_url ?? ''
    };
  }

  saveEdit(id: string) {
    this.api.updateProduct(id, this.editProduct).subscribe({
      next: (updated) => {
        const idx = this.products.findIndex(p => p.id === id);
        if (idx > -1) this.products[idx] = updated;
        this.editingId = null;
        this.success = 'Product updated!';
        setTimeout(() => this.success = '', 2000);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to update.';
      }
    });
  }

  cancelEdit() {
    this.editingId = null;
  }

  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.api.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.success = 'Product deleted.';
        setTimeout(() => this.success = '', 2000);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to delete.';
      }
    });
  }
}
