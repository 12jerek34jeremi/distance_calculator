<?php
/**
 * Distance Calculation Endpoint (calculate.php)
 *
 * This script receives two geographic points (latitude and longitude for each)
 * via HTTP GET parameters and returns the calculated distance between them in meters,
 * using the Haversine formula.
 *
 * Expected GET parameters:
 * - lat-a, lon-a: Coordinates of the first point
 * - lat-b, lon-b: Coordinates of the second point
 *
 * Example request:
 *   /calculate.php?lat-a=40.7128&lon-a=-74.0060&lat-b=34.0522&lon-b=-118.2437
 *
 * Example response:
 *   3935746
 *
 * If any parameter is missing or invalid, the script responds with:
 *   error
 */



  /**
 * Calculates the distance between two geographic coordinates using the Haversine formula. The
 * returned distance is in meters.
 * Source: Adapted from the JavaScript version on StackOverflow  
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
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
      $latA < -90 || $latA > 90 ||
      $latB < -90 || $latB > 90 ||
      $lonA < -180 || $lonA > 180 ||
      $lonB < -180 || $lonB > 180
  ) {
      echo "error";
      exit;
  }
  
  $distance = calculateDistance($latA, $lonA, $latB, $lonB);
  echo round($distance);
?>

