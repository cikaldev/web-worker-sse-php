/**
 * TL;DR
 * 
 * Kesempurnaan hanya milik ALLAH S.W.T
 * Silahkan jika anda ingin mempelajari source code ini.
 * Semoga bermanfaat..
 *
 * @author iancikal <cikaldev@gmail.com>
 * @since  Jan 2021
 */

self.addEventListener('message', async event => {
  const sse = (event.data === 'seruputKuy')
    ? new EventSource('/static/php/src.php')
    : new EventSource(`/static/php/dl.php?id=${event.data}`);
  
  // ------------------------------------------------------------------------
  
  sse.addEventListener('GEN_SRC_JSON_PROGRESS', (e) => {
    self.postMessage(JSON.parse(e.data))
  }, false)

  sse.addEventListener('GEN_SRC_JSON_DONE', () => {
    self.postMessage('selesai')
    sse.close(); // stop retry
  }, false)
  
  // ------------------------------------------------------------------------
  
  sse.addEventListener('DOWNLOAD_PROGRESS', (e) => {
    let obj = JSON.parse(e.data)
    self.postMessage({
      code: 1,
      id: obj.id,
      perc: obj.perc
    })
  }, false)
  
  sse.addEventListener('DOWNLOAD_COMPLETE', () => {
    self.postMessage({
      code: 2,
      id: event.data
    })
    sse.close(); // stop retry
  }, false)


})