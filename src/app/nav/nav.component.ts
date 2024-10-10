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
                routerLink: '/auth/convocatorias'
            },
            {
                label: 'Agenda',
                replaceUrl: true, 
                routerLink: '/auth/agenda'
            },
            {
                label: 'Registros',
                replaceUrl: true, 
            },
            {
                label: 'FAQs',
                replaceUrl: true, 
                routerLink: '/auth/faq'
            },
            {
                label: 'Salir',
                replaceUrl: true, 
                routerLink: '/auth'
            },
        ];
    }
}
