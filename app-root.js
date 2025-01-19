/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './src/components/employee-list/index.js';
import './src/components/shared/navigation-bar.js';

export class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        --app-font-family: 'Inter', -apple-system, BlinkMacSystemFont,
          'Segoe UI', Roboto, sans-serif;
        font-family: var(--app-font-family);
      }

      #outlet {
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
      }
    `;
  }

  constructor() {
    super();
  }

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      {
        path: '/',
        component: 'employee-list',
      },
      {
        path: '/edit/:id',
        component: 'employee-form',
      },
      {
        path: '/create',
        component: 'employee-form',
      },
      {
        path: '(.*)',
        component: 'employee-list',
      },
    ]);
  }

  render() {
    return html`
      <navigation-bar></navigation-bar>
      <main id="outlet"></main>
    `;
  }
}

window.customElements.define('app-root', AppRoot);
