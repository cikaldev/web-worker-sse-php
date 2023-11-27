<?php
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

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$id = $_GET['id'];
#$filename = sprintf("%03s-1.mp3", $id);
#$uri = sprintf("https://download.quranicaudio.com/ayah/afasy/%s", $filename);
$filename = sprintf("%03s.mp3", $id);
$uri = sprintf("https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/%s", $filename);

function update_source($id) {
  $json = json_decode(file_get_contents(__DIR__.'/../source.json'), false);
  foreach ($json as $rs) {
    if ($rs->id == $id) {
      $rs->has_download = true;
      break;
    }
  }
  file_put_contents(__DIR__.'/../source.json', json_encode($json, JSON_PRETTY_PRINT));
}

function streaming() {
  $args = func_get_args();
  if ($args[0] == 7) {
    $dataset = [
      "id" => $_GET['id'],
      "perc" => ceil($args[4]/$args[5]*100)
    ];
    echo "event: DOWNLOAD_PROGRESS\ndata: ".json_encode($dataset)."\n\n";
    flush();
    ob_flush();
    usleep(rand(1000, 10000));
  }
}

$ctx = stream_context_create(null, array('notification' => 'streaming'));
$fpIn = fopen($uri, "rb", false, $ctx);
file_put_contents(__DIR__."/../audio/surah/$filename", $fpIn);
update_source($id);

// Give browser a signal to stop re-opening connection
echo "event: DOWNLOAD_COMPLETE\ndata: END-OF-STREAM\n\n";
flush();
ob_flush();

// give browser enough time to close connection
usleep(rand(50000, 1000000));

/* End of file dl.php */
/* Location: ./worker/static/php/dl.php */
