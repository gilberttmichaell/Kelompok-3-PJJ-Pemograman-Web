import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Header, Footer, Sidebar, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {}