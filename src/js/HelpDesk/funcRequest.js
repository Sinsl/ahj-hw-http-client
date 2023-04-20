export default async function requestServer(options, callback) {
  const url = 'http://localhost:7070/ticket' + options.url;
  const response = await fetch(url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: options.body,
  });
  const data = await response.json();
  await callback(data);
}
