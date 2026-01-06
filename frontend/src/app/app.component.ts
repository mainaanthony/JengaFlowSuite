import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './app.component.html'
})
///initial comment 2026 push test
export class AppComponent {
  title = 'frontend';
  products: any[] = [];

  constructor(private http: HttpClient) {}

  loadProducts() {
    const query = `{ products { nodes { id name price } } }`;
    this.http.post<any>('http://localhost:5000/graphql', { query })
      .subscribe(res => this.products = res.data.products.nodes);
  }
}
