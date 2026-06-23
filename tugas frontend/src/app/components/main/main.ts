import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    Footer,
    RouterOutlet
  ],
  // templateUrl: './main.html',
  styleUrls: ['./main.css'],
  template: `

<div id="wrapper">

  <!-- Sidebar -->
  <app-sidebar></app-sidebar>

  <!-- Content Wrapper -->
  <div id="content-wrapper" class="d-flex flex-column">

    <!-- Main Content -->
    <div id="content">

      <!-- Topbar -->
      <app-header></app-header>

      <!-- Page Content -->
      <div class="container-fluid">
        <h1>Dashboard</h1>
      </div>
      <router-outlet></router-outlet>
    </div>

    <!-- Footer -->
    <app-footer></app-footer>

  </div>

</div>

<!-- Scroll to Top Button -->
<a class="scroll-to-top rounded" href="#page-top">
  <i class="fas fa-angle-up"></i>
</a>

<!-- Logout Modal (GLOBAL - di luar wrapper) -->
<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Ready to Leave?</h5>
        <button class="close" type="button" data-dismiss="modal">
          <span>&times;</span>
        </button>
      </div>

      <div class="modal-body">
        Select "Logout" below if you are ready to end your current session.
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
        <a class="btn btn-primary" href="login.html">Logout</a>
      </div>

    </div>
  </div>
</div>
`

})
export class Main {}
