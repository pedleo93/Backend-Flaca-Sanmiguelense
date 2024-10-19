import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    standalone: true,
    imports: [MenubarModule]
})
export class NavComponent {
    items!: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'Convocatorias',
                replaceUrl: true,
                routerLink: '/convocatorias'
            },
            {
                label: 'Agenda',
                replaceUrl: true, 
                routerLink: '/agenda'
            },
            {
                label: 'Registros',
                replaceUrl: true,
                routerLink: '/registro-convocatorias' 
            },
            {
                label: 'Patrocinadores',
                replaceUrl: true,
                routerLink: '/patrocinadores' 
            },
            {
                label: 'FAQs',
                replaceUrl: true, 
                routerLink: '/faq'
            },
            {
                label: 'Salir',
                replaceUrl: true, 
                routerLink: '/login'
            },
        ];
    }
}
