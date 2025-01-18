import {LitElement, html, css} from 'lit';
import 'fa-icons';

import {MODAL_TYPES} from '../../consts/modalTypes';
import i18n, {LANGUAGES} from '../../services/i18n';
import store from '../../services/store';

export class NavigationBar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .logo-section {
      display: flex;
      align-items: center;
    }

    .logo {
      background-color: #ff6b00;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .employees-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4b5563;
      text-decoration: none;
    }

    .employees-link:hover {
      color: #1f2937;
    }

    .add-new-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #ff6b00;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      height: 2rem;
    }

    .add-new-btn:hover {
      background-color: #e65a00;
    }

    .lang-selector {
      position: relative;
      display: flex;
      align-items: center;
      height: 2rem;
    }

    .lang-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      cursor: pointer;
      background: white;
      color: #4b5563;
      font-size: 0.875rem;
      height: 100%;
    }

    .lang-button:hover {
      border-color: #d1d5db;
    }

    .lang-button:after {
      content: '';
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid currentColor;
      margin-left: 4px;
    }

    .lang-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.25rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: none;
      z-index: 10;
    }

    .lang-dropdown.open {
      display: block;
    }

    .lang-option {
      padding: 0.5rem 1rem;
      cursor: pointer;
      white-space: nowrap;
      color: #4b5563;
      font-size: 0.875rem;
    }

    .lang-option:hover {
      background-color: #f3f4f6;
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .nav-container {
        padding: 0.75rem;
      }

      .employees-link span {
        display: none;
      }

      .add-new-btn span {
        display: none;
      }
    }
  `;

  static get properties() {
    return {
      language: {type: String},
      isDropdownOpen: {type: Boolean},
    };
  }

  constructor() {
    super();

    const initialState = store.getState();
    this.language = initialState.language;
    this.isDropdownOpen = false;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        language: state.language,
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (this[key] !== value) {
          this[key] = value;
        }
      });
    });

    // Close dropdown when clicking outside
    this._handleClickOutside = this._handleClickOutside.bind(this);
    document.addEventListener('click', this._handleClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    document.removeEventListener('click', this._handleClickOutside);
  }

  _handleClickOutside(event) {
    const langSelector = this.shadowRoot.querySelector('.lang-selector');
    if (langSelector && !langSelector.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  _toggleDropdown(e) {
    e.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  _handleLanguageChange(l) {
    store.setLanguage(l);
    this.isDropdownOpen = false;
  }

  _getCurrentLanguageName() {
    const currentLang = Object.values(LANGUAGES).find(
      (lang) => lang.value === this.language
    );
    return currentLang ? currentLang.name : 'Language';
  }

  _handleAddNew() {
    store.openModal(MODAL_TYPES.ADD_EDIT, null);
  }

  render() {
    return html`
      <nav class="nav-container">
        <div class="logo-section">
          <div class="logo">ING</div>
        </div>

        <div class="right-section">
          <a href="/#" class="employees-link">
            <span>${i18n.t('navigation.employees')}</span>
          </a>

          <button class="add-new-btn" @click=${this._handleAddNew}>
            <fa-icon class="fas fa-plus" color="white" size="1em"></fa-icon>
            <span> ${i18n.t('navigation.addEmployee')}</span>
          </button>

          <div class="lang-selector">
            <button class="lang-button" @click=${this._toggleDropdown}>
              ${this._getCurrentLanguageName()}
            </button>
            <div class="lang-dropdown ${this.isDropdownOpen ? 'open' : ''}">
              ${Object.values(LANGUAGES).map(
                (languageItem) => html`
                  <div
                    class="lang-option"
                    @click=${() =>
                      this._handleLanguageChange(languageItem.value)}
                  >
                    ${languageItem.name}
                  </div>
                `
              )}
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('navigation-bar', NavigationBar);
