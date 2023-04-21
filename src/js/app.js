import HelpDeskField from './HelpDesk/HelpDeskField';
import requestServer from './HelpDesk/funcRequest';

const main = document.querySelector('.main');

// eslint-disable-next-line no-unused-vars
const field = new HelpDeskField(main);

setInterval(() => {
  requestServer(
    {
      url: '/index',
      method: 'GET',
    },
    (resp) => {
      console.log(resp.status);
    }
  );
}, 600000);
