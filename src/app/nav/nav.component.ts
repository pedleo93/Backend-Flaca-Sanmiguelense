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
                routerLink: '/admin/convocatorias'
            },
            {
                label: 'Agenda',
                replaceUrl: true, 
                routerLink: '/admin/agenda'
            },
            {
                label: 'Registros',
                replaceUrl: true,
                routerLink: '/admin/registro-convocatorias' 
            },
            {
                label: 'Patrocinadores',
                replaceUrl: true,
                routerLink: '/admin/patrocinadores' 
            },
            {
                label: 'FAQs',
                replaceUrl: true, 
                routerLink: '/admin/faq'
            }
        ];
    }
}
