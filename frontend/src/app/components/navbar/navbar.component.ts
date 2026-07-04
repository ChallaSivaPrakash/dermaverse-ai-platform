import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  cartCount = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuth();
    this.updateCart();
    window.addEventListener('storage', () => {
      this.checkAuth();
      this.updateCart();
    });
  }

  checkAuth() {
    this.isLoggedIn = !!localStorage.getItem('jwt_token');
  }

  updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
