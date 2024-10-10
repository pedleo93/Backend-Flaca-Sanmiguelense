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
                items: [{
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus'
                },
                { label: 'Lista',  url: '/login/convocatorias'}
                ]
            },
            {
                label: 'Agenda',
                items: [{
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus'
                },
                { label: 'Lista', url: '/login/agenda' }
                ]
            },
            {
                label: 'Registros',
                items: [{
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus'
                },
                { label: 'Lista', url: '/login/registro-convocatorias' }
                ]
            },
            {
                label: 'FAQs',
                items: [{
                    label: 'Nueva',
                    icon: 'pi pi-fw pi-plus'
                },
                { label: 'Lista', url: '/login/faq' }
                ]
            },
            {
                label: 'Salir'
            },
        ];
    }
}
