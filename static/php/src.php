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

$results = [];
foreach (range(1, 114) as $num) {
  #$fname = sprintf("%03s-1.mp3",$num);
  #$uri = "https://download.quranicaudio.com/ayah/afasy/$fname";
  $fname = sprintf("%03s.mp3",$num);
  $uri = "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/$fname";
  $header = get_headers($uri, true);

  $size = $header['Content-Length'];

  $base = log($size, 1024);
  $units = array('B', 'KB', 'MB', 'GB', 'TB')[floor($base)];

  $dataset = [
    "id" => $num,
    "name" => $fname,
    "size" => number_format(pow(1024, $base - floor($base)), 2) . ' ' . $units,
    "has_download" => false,
    "raw_data" => $header
  ];
  $results[] = $dataset;
  echo "event: GEN_SRC_JSON_PROGRESS\ndata: ".json_encode($dataset)."\n\n";
  flush();
  ob_flush();
  usleep(rand(1000, 10000));
}

file_put_contents(__DIR__.'/../source.json', json_encode($results, JSON_PRETTY_PRINT));

// Give browser a signal to stop re-opening connection
echo "event: GEN_SRC_JSON_DONE\ndata: \n\n";
flush();
ob_flush();

/* End of file src.php */
/* Location: ./worker/static/php/src.php */
