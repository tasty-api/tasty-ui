const axios = require('axios');
const moment = require('moment');

module.exports.getMessage = ({
   testRunLink, start, suites, tests, passes, failures, pending, duration, end, users,
 }) => `Tests were finished with <b>${failures > 0 ? 'FAILURE' : 'SUCCESS'}</b>:
${testRunLink ? `<a href='${testRunLink}'>Test run</a>` : ''}
    <i>Started at</i>: <b>${moment(start).format('DD/MM/YY hh:mm:ss')}</b>
    <i>Total suites</i>: <b>${suites}</b>
    <i>Total tests</i>: <b>${tests}</b>
    <i>Successful tests</i>: <b>${passes}</b>
    <i>Failing tests</i>: <b>${failures}</b>
    <i>Pending tests</i>: <b>${pending}</b>
    <i>Total duration</i>: <b>${duration}</b>
    <i>Finished at</i>: <b>${moment(end).format('DD/MM/YY hh:mm:ss')}</b>
${failures && users.length ? users.join(', ') : ''}
`;

module.exports.isNotificationEnabled = (notificationConfig) => !!(notificationConfig.chat_id && notificationConfig.token);

module.exports.notify = async (message, notificationConfig) => {
  const proxy = notificationConfig.proxy || null;
  const token = encodeURIComponent(notificationConfig.token);
  const url = notificationConfig.url || `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await axios.post(url, {
      chat_id: notificationConfig.chat_id,
      text: message,
      parse_mode: 'HTML',
    }, {
      proxy
    });

    return res.data;
  } catch (err) {
    throw new Error(`Telegram Notification: ${err.message}`);
  }
};
