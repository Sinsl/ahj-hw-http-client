import Form from './Form';

export default class Modal {
  constructor() {
    this.forms = new Form();
    this.elem = null;
    this.formTicket = null;
    this.formDelete = null;
    this.eventReset = null;
    this.eventSubmitChange = null;
    this.eventSubmitDelete = null;
    this.createModal();
    this.createForm();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    this.elem = modal;
  }

  createForm() {
    this.formTicket = this.forms.formCreate;
    this.formDelete = this.forms.formDelete;
    this.registerEvents();
  }

  registerEvents() {
    this.forms.addEventReset(this.onReset.bind(this));
    this.forms.addEventSubmitDelete(this.onSubmitDelete.bind(this));
    this.forms.addEventSubmitChange(this.onSubmitChange.bind(this));
  }

  addEventReset(callback) {
    this.eventReset = callback;
  }

  onReset() {
    this.eventReset.call(null);
  }

  addEventSubmitDelete(callback) {
    this.eventSubmitDelete = callback;
  }

  onSubmitDelete() {
    this.eventSubmitDelete.call(null);
  }

  addEventSubmitChange(callback) {
    this.eventSubmitChange = callback;
  }

  onSubmitChange() {
    this.eventSubmitChange.call(null);
  }
}
