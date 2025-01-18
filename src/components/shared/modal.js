import {LitElement, html, css} from 'lit';

import store from '../../services/store';

export class Modal extends LitElement {
  static properties = {
    title: {type: String},
    isOpen: {type: Boolean},
  };

  static styles = css`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-container {
      background: white;
      border-radius: 8px;
      padding: 24px;
      min-width: 560px;
      max-width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-title {
      margin: 0;
      color: #ff6b00;
      font-size: 1.25rem;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #666;
      font-size: 1.5rem;
      line-height: 1;
    }

    .close-button:hover {
      color: #ff6b00;
    }

    @media (max-width: 768px) {
      .modal-container {
        width: 100%;
        height: 100%;
        min-width: unset;
        max-width: 100%;
        max-height: 100%;
        border-radius: 0;
        margin: 0;
      }

      .modal-overlay {
        align-items: flex-start;
      }
    }
  `;

  constructor() {
    super();
    this.title = '';
    this.isOpen = false;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        language: state.language,
        modals: state.modals,
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (this[key] !== value) {
          this[key] = value;
        }
      });
    });
  }

  _close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('modal-close'));
  }

  render() {
    if (!this.isOpen) return null;

    return html`
      <div
        class="modal-overlay"
        @click="${(e) => e.target === e.currentTarget && this._close()}"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button class="close-button" @click="${this._close}">×</button>
          </div>
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('lit-modal', Modal);
