import requestServer from './funcRequest';

export default class Card {
  constructor(params) {
    this.elem = null;
    this.id = params.id;
    this.status = null;
    this.onEventClickStatus = this.onClickStatus.bind(this);
    this.onEventClickDesc = this.onClickDesc.bind(this);
    this.onEventClickEdit = null;
    this.onEventClickDelete = null;
    this.createCard(params);
  }

  createCard(params) {
    const card = document.createElement('div');
    card.className = 'hd-card';
    card.dataset.id = this.id;
    card.insertAdjacentHTML(
      'beforeend',
      `<div class="hd-card_check">
        <div class="hd-card_check__round"></div>
      </div>
      <div class="hd-card_body">
        <div class="hd-card_body__header">
          <div class="hd-card_body__header-title">${params.name}</div>
          <div class="hd-card_body__header-time"></div>
        </div>
        <div class="hd-card_body__description"></div>
      </div>
      <div class="hd-card_change">
        <div class="hd-card_change_round hd-card_change__put">
          <i class="fa-solid fa-pencil"></i>
        </div>
        <div class="hd-card_change_round hd-card_change__delete">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>`
    );
    this.elem = card;
    this.status = params.status === undefined ? false : params.status;
    this.addStatus();
    this.addTime(params.created);
    this.registerEvents();
  }

  addStatus() {
    const roundEl = this.elem.querySelector('.hd-card_check__round');
    if (this.status) {
      roundEl.innerHTML = '<i class="fa-solid fa-check"></i>';
    } else {
      roundEl.innerHTML = '';
    }
  }

  addTime(created) {
    const date = created ? new Date(created) : Date.now();
    const strDate = date.toLocaleString('ru-Ru', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    this.elem.querySelector('.hd-card_body__header-time').textContent =
      strDate.replace(',', '');
  }

  addDescription(desc) {
    if (desc) {
      const descEl = this.elem.querySelector('.hd-card_body__description');
      descEl.innerHTML = desc;
      descEl.classList.add('active');
    }
  }

  changeParam(name, desc) {
    this.elem.querySelector('.hd-card_body__header-title').textContent = name;
    this.elem.querySelector('.hd-card_body__description').innerHTML = desc;
  }

  registerEvents() {
    this.elem
      .querySelector('.hd-card_check')
      .addEventListener('click', this.onEventClickStatus);
    this.elem
      .querySelector('.hd-card_body')
      .addEventListener('click', this.onEventClickDesc);
    this.elem
      .querySelector('.hd-card_change__put')
      .addEventListener('click', this.onClickEdit.bind(this));
    this.elem
      .querySelector('.hd-card_change__delete')
      .addEventListener('click', this.onClickDelete.bind(this));
  }

  onClickStatus() {
    const status = !this.status;
    const data = JSON.stringify({ status: status });
    const options = {
      url: '/status/' + this.id,
      method: 'PUT',
      body: data,
    };
    requestServer(options, (resp) => {
      if (resp.status === 'ok') {
        this.status = status;
        this.addStatus();
      }
    });
  }

  onClickDesc(e) {
    const bodyEl = e.target.closest('.hd-card_body');
    const descEl = bodyEl.querySelector('.hd-card_body__description');
    if (descEl.classList.contains('active')) {
      descEl.classList.remove('active');
      descEl.innerHTML = '';
    } else {
      const options = {
        url: '/desc/' + this.id,
        method: 'GET',
      };
      requestServer(options, (resp) => {
        if (resp.status === 'ok') {
          this.addDescription(resp.desc);
        } else {
          this.addDescription(resp.desc);
          setTimeout(() => {
            descEl.classList.remove('active');
            descEl.innerHTML = '';
          }, 3000);
        }
      });
    }
  }

  addListenerEdit(callback) {
    this.onEventClickEdit = callback;
  }

  addListenerDelete(callback) {
    this.onEventClickDelete = callback;
  }

  onClickEdit() {
    this.onEventClickEdit.call(null, this.id);
  }

  onClickDelete() {
    this.onEventClickDelete.call(null, this.id);
  }

  removeAllListener() {
    this.elem
      .querySelector('.hd-card_check')
      .removeEventListener('click', this.onEventClickStatus);
    this.elem
      .querySelector('.hd-card_body')
      .removeEventListener('click', this.onEventClickDesc);
    this.elem
      .querySelector('.hd-card_change__put')
      .removeEventListener('click', this.onClickEdit);
    this.onEventClickEdit = null;
    this.elem
      .querySelector('.hd-card_change__delete')
      .removeEventListener('click', this.onClickDelete);
    this.onEventClickDelete = null;
  }
}
