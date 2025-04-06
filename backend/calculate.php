<?php
  function calculateDistance(float $latA, float $lonA, float $latB, float $lonB): float {
      $R = 6371000; // Radius of the earth in meters
      $dLat = deg2rad($latB - $latA);
      $dLon = deg2rad($lonB - $lonA);
      $a = sin($dLat / 2) * sin($dLat / 2) +
          cos(deg2rad($latA)) * cos(deg2rad($latB)) *
          sin($dLon / 2) * sin($dLon / 2);
      $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
      $d = $R * $c; // Distance in meters
      return $d;
  }

  header('Content-Type: text/plain');

  if (!isset($_GET['lat-a'], $_GET['lon-a'], $_GET['lat-b'], $_GET['lon-b'])) {
    echo "error";
    exit;
  }

  $latA = filter_var($_GET['lat-a'], FILTER_VALIDATE_FLOAT);
  $lonA = filter_var($_GET['lon-a'], FILTER_VALIDATE_FLOAT);
  $latB = filter_var($_GET['lat-b'], FILTER_VALIDATE_FLOAT);
  $lonB = filter_var($_GET['lon-b'], FILTER_VALIDATE_FLOAT);

  if (
      $latA === false || $lonA === false || $latB === false || $lonB === false ||
      $latA <= -90 || $latA >= 90 ||
      $latB <= -90 || $latB >= 90 ||
      $lonA <= -180 || $lonA >= 180 ||
      $lonB <= -180 || $lonB >= 180
  ) {
      echo "error";
      exit;
  }
  
  $distance = calculateDistance($latA, $lonA, $latB, $lonB);
  echo round($distance);

  sleep(3);
?>

