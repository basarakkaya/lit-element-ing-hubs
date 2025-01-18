/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';

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
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <navigation-bar></navigation-bar>
      <employee-list></employee-list>
    `;
  }
}

window.customElements.define('app-root', AppRoot);
