export default class Form {
  constructor() {
    this.formCreate = null;
    this.formDelete = null;
    this.eventReset = null;
    this.eventSubmitDelete = null;
    this.eventSubmitChange = null;
    this.init();
  }

  init() {
    this.addFormCreate();
    this.addFormDelete();
    this.registerEvent();
  }

  registerEvent() {
    this.formCreate.addEventListener('reset', this.onReset.bind(this));
    this.formCreate.addEventListener('submit', this.onSubmitChange.bind(this));
    this.formDelete.addEventListener('reset', this.onReset.bind(this));
    this.formDelete.addEventListener('submit', this.onSubmitDelete.bind(this));
  }

  addFormCreate() {
    const form = document.createElement('form');
    form.className = 'form form-add';
    form.insertAdjacentHTML(
      'beforeend',
      `<h3>Добавить тикет</h3>
      <div class="form-body">
        <label>
          <p>Краткое описание</p>
          <input type="text" name="title" required>
        </label>
        <label>
          <p>Подробное описание</p>
          <textarea type="text" name="description" rows="5"></textarea>
        </label>
      </div>
      <div class="form-button">
        <button type="reset" class="btn btn-reset">Отмена</button>
        <button type="submit" class="btn btn-submit">Ок</button>
      </div>`
    );
    this.formCreate = form;
  }

  addFormDelete() {
    const form = document.createElement('form');
    form.className = 'form form-delete';
    form.insertAdjacentHTML(
      'beforeend',
      `<h3>Удалить тикет</h3>
      <div class="form-body">
        <p>Вы уверены, что хотите удалить тикет?</p>
        <p>Это действие необратимо.</p>
      </div>
      <div class="form-button">
        <button type="reset" class="btn btn-reset">Отмена</button>
        <button type="submit" class="btn btn-submit">Ок</button>
      </div>`
    );
    this.formDelete = form;
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

  onSubmitDelete(e) {
    e.preventDefault();
    this.eventSubmitDelete.call(null);
  }

  addEventSubmitChange(callback) {
    this.eventSubmitChange = callback;
  }

  onSubmitChange(e) {
    e.preventDefault();
    this.eventSubmitChange.call(null);
  }
}
