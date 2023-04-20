import './modal/css/form.css';
import requestServer from './funcRequest';
import Card from './Card';
import Modal from './modal/Modal';

export default class HelpDeskField {
  constructor(element) {
    this.elem = element;
    this.arrCards = [];
    this.modal = new Modal();
    this.createField();
    this.getCards();
    this.eventregister();
  }

  createField() {
    const title = document.createElement('H2');
    title.textContent = 'HelpDesk';
    this.elem.append(title);

    const field = document.createElement('div');
    field.className = 'helpdesk';
    field.insertAdjacentHTML(
      'beforeend',
      `<div class="hd-add">
        <a href="" class="hd-add-ticket">Добавить тикет</a>
      </div>
      <div class="hd-cards"></div>`
    );
    this.elem.append(field);
  }

  /**
   * При первой загрузке запрашивает данные с сервера
   * Добавляет тикеты на страницу
   */
  getCards() {
    const options = {
      url: '/list',
      method: 'GET',
    };
    requestServer(options, (resp) => {
      resp.tickets.forEach((item) => {
        const card = new Card(item);
        this.arrCards.push(card);
        this.elem.querySelector('.hd-cards').append(card.elem);
        card.addListenerEdit(this.onClickEdit.bind(this));
        card.addListenerDelete(this.onClickDelete.bind(this));
      });
    });
  }

  /**
   * Регистрация событий и подписок
   */
  eventregister() {
    this.modal.addEventReset(this.onReset.bind(this));
    this.elem
      .querySelector('.hd-add-ticket')
      .addEventListener('click', this.onCreateTicket.bind(this));
  }

  /**
   * Событие создания нового тикета
   * Открывает форму для заполнения полей
   */
  onCreateTicket(e) {
    e.preventDefault();
    this.modal.elem.append(this.modal.formTicket);
    document.body.append(this.modal.elem);
    this.modal.addEventSubmitChange(this.onSubmitCreate.bind(this));
  }

  /**
   * Создает тикет по нажатию на submit
   * Отправляет данные на сервер
   */
  onSubmitCreate() {
    const text =
      '<p>' +
      this.modal.formTicket.description.value
        .replace(/\n/g, '</p><p>')
        .replace(/<p>$/, '') +
      '</p>';
    let data = JSON.stringify({
      name: this.modal.formTicket.title.value,
      status: false,
      created: Date.now(),
      description: text,
    });
    const options = {
      url: '/create',
      method: 'POST',
      body: data,
    };
    requestServer(options, (resp) => {
      if (resp.status === 'ok') {
        data = JSON.parse(data);
        data.id = resp.id;
        const card = new Card(data);
        this.arrCards.push(card);
        this.elem.querySelector('.hd-cards').append(card.elem);
        card.addListenerEdit(this.onClickEdit.bind(this));
        card.addListenerDelete(this.onClickDelete.bind(this));
      }
    });
    this.modal.formTicket.reset();
    this.modal.formTicket.remove();
    this.modal.elem.remove();
  }

  /**
   * Обработчик события при нажатии кнопки "отменить" на формах
   */
  onReset() {
    this.modal.formTicket.remove();
    this.modal.formDelete.remove();
    this.modal.elem.remove();
  }

  /**
   * Обработчик события нажатия на иконку редактирования
   * Запрашивает данные с сервера
   */
  onClickEdit(id) {
    this.modal.elem.append(this.modal.formTicket);
    document.body.append(this.modal.elem);

    const options = {
      url: '/' + id,
      method: 'GET',
    };
    requestServer(options, (resp) => {
      if (resp.status === 'ok') {
        const text = resp.ticket.description
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '\n');
        this.modal.formTicket.title.value = resp.ticket.name;
        this.modal.formTicket.description.value = text;
      }
    });
    this.modal.addEventSubmitChange(this.onSubmitChange.bind(this, id));
  }

  /**
   * Обработчик события нажатия на кнопку "ок" на форме
   * Отправляет данные на сервер
   * @param id идентификатор тикета
   */
  onSubmitChange(id) {
    const text =
      '<p>' +
      this.modal.formTicket.description.value
        .replace(/\n/g, '</p><p>')
        .replace(/<p>$/, '');
    const data = JSON.stringify({
      name: this.modal.formTicket.title.value,
      description: text,
    });
    const options = {
      url: '/change/' + id,
      method: 'PUT',
      body: data,
    };
    requestServer(options, (resp) => {
      if (resp.status === 'ok') {
        const elem = this.arrCards.find((item) => item.id === id);
        elem.changeParam(this.modal.formTicket.title.value, text);
        this.modal.formTicket.reset();
      }
    });
    this.modal.formTicket.remove();
    this.modal.elem.remove();
  }

  /**
   * Обработчик события нажатия на кнопку "ок"
   * Форма подтверждения удаления тикета
   * @param id идентификатор тикета
   */
  onSubmitDelete(id) {
    this.modal.formDelete.remove();
    this.modal.elem.remove();

    const options = {
      url: '/delete/' + id,
      method: 'DELETE',
    };
    requestServer(options, (resp) => {
      if (resp.status === 'ok') {
        let card = this.arrCards.find((item) => item.id === id);
        card.removeAllListener();
        card.elem.remove();
        this.arrCards = this.arrCards.filter((item) => item.id !== id);
        card = null;
      }
    });
  }

  /**
   * Обработчик события нажатия на иконку "удалить"
   * @param id идентификатор тикета
   */
  onClickDelete(id) {
    this.modal.elem.append(this.modal.formDelete);
    document.body.append(this.modal.elem);
    this.modal.addEventSubmitDelete(this.onSubmitDelete.bind(this, id));
  }
}
