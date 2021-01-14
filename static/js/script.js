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

// helper
const $ = elem => document.querySelector(elem)

// worker (2 aja cukup buat belajar)
let workerBandel, workerTeladan;


function download(id, btn) {
  workerTeladan = new Worker('/static/js/worker.js')
  const pbQue = $(`#pbar${id}`)
  
  btn.disabled=true
  btn.innerText="queued"
  pbQue.removeAttribute('value')
  workerTeladan.postMessage(id)

  workerTeladan.addEventListener('message', e => {
    updateProgress(e.data)
  })

  function updateProgress(obj) {
    const label = $(`#_label_pbar${obj.id}`)
    const pbar = $(`#pbar${obj.id}`)

    if (obj.code == 1) {
      label.innerHTML = obj.perc + '%'
      pbar.value = obj.perc
    } else if (obj.code == 2) {
      label.innerHTML = "selesai"
      label.parentNode.classList.add('sudah')
      pbar.value = 100
    }
  }
}

function createIndexSource() {
  workerBandel = new Worker('/static/js/worker.js')
  const tbl = $('table'), div = $('div'),
    raw = $('pre'), pbar = $('#pbarProsesIndex'),
    btn = $('#btnCreateIndex'), det = $('details'),
    sum = $('summary')

  tbl.style.display = 'none'
  div.style.display = 'block'

  workerBandel.addEventListener('message', e => {
    if (e.data != 'selesai') {
      pbar.value = Math.ceil(e.data.id / 114 * 100)
      sum.innerText = `Lihat Detail [${e.data.id}/114] ${pbar.value}%`
      raw.innerText = JSON.stringify(e.data, null, 2)
    } else {
      // 
      // penting buat STOP re-spawn worker (a.k.a) devil process
      // klo dah kebanyakan worker susah sendiri ntar.
      // 
      workerBandel.terminate() // <----- ndablek, kepala batu
      workerBandel = undefined // <----- suek nih bocah!

      det.style.display = 'none'
      pbar.removeAttribute('value')
      pbar.insertAdjacentHTML('afterend', '<p>Seeding file, please wait...</p>')
      
      // timeout sengaja dibuat, untuk ngasih kesempatan ke browser
      // buat menyelesaikan pending proses (jika ada) ideal nya 3000 ms
      // disini sy gunakan 5000 ms (krn spek PC yg kentang). wkwkwkwk; 
      setTimeout(function() {
        location.reload()
      }, 5000);
    }
  })

  btn.addEventListener('click', () => {
    workerBandel.postMessage('seruputKuy')
    pbar.removeAttribute('value')
    det.style.display = 'block'
    det.setAttribute('open','')
    btn.remove()
  }, false)
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('static/source.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(rs => {
        const str = (!rs.has_download)
          ? `<tr><td>${rs.name}</td><td>${rs.raw_data['Content-Type']}</td><td><progress value="0" max="100" id="pbar${rs.id}"></progress></td><td align="right">${rs.size}</td><td id="_label_pbar${rs.id}"><button onclick="download(${rs.id},this)">Download</button></td></tr>`
          : `<tr class="sudah"><td>${rs.name}</td><td>${rs.raw_data['Content-Type']}</td><td><progress value="100" max="100"></progress></td><td align="right">${rs.size}</td><td>selesai</td></tr>`

        $('tbody').insertAdjacentHTML('beforeend', str)
      })
    })
    .catch(err => createIndexSource())
}, false)