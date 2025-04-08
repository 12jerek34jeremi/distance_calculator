# Distance Calculator

A web application for calculating the distance between two geographic points.  
Users can enter the coordinates of both points in any of the following formats:

- `'d'`  : Decimal degrees (e.g., `45.123456° N`)
- `'dm'` : Degrees and decimal minutes (e.g., `045° 07.4073' N`)
- `'dms'`: Degrees, minutes, and decimal seconds (e.g., `045° 07' 24.44" N`)

After entering both coordinates, click the **Calculate** button.  
The computed distance between the points will be displayed below the input fields.

## Exemplary Screenshots and Video

***[Video Link (click)](https://drive.google.com/file/d/1JhfXDONRNpHcBuPHtD-bOjZ1HUrJua9Q/view?usp=sharing)***

<div align="center">
<table>
  <tr>
    <td align="center">
      <strong>Desktop View</strong><br>
      <img src="./img/screen_desktop.png" alt="Distance Calculator - Desktop View" width="500"/>
    </td>
    <td align="center">
      <strong>Mobile View</strong><br>
      <img src="./img/screen_mobile.png" alt="Distance Calculator - Mobile View" width="250"/>
    </td>
  </tr>
</table>
</div>

## Frameworks and Architecture

The application is built using Vue.js for the frontend and PHP for the backend. The frontend is
written in Vue.js using Single File Components. All frontend code is located in the [frontend
directory](./frontend/). The frontend allows users to input two geographic points (latitude and
longitude). Once both points are entered, their coordinates are sent to the backend server via an
HTTP GET request. The backend, written in PHP, processes the coordinates and returns the calculated
distance in meters. The backend logic for distance calculation is implemented in  [calculate.php](backend/calculate.php). For example:  
```your-server-address/calculate.php?lat-a=40.7&lon-a=-74.2&lat-b=34.3&lon-b=-118.2```   
would return "3904686"  

## How to run it

### For Production:
To build and run the app using Docker, simply execute the following two commands:
```bash
docker build -t discal .
```
```bash
docker run -d -p 80:80 discal
```
You can then access the website at ["localhost:80"]().

### For development
1) Set up a php server. Instructions vary depending on your operating system and setup, so they are not included here.
  
2) Add [calculate.php file](backend/calculate.php) to your php server. You can either set backend directory as your php server root directory, or copy the [calculate.php file](backend/calculate.php) file to your server directory. Check if it works. Enter [localhost:80/calculate.php?lat-a=40.7&lon-a=-74.2&lat-b=34.3&lon-b=-118.2](), it should return "3904686".  
Note: If you're using a different port than 80, not hosting locally, or calculate.php is not in the root directory of your server, adjust the URL accordingly.  
Example:  
```your-dev-server.net:5000/path/to/calculate-php-file/calculate.php?lat-a=40.7&lon-a=-74.2&lat-b=34.3&lon-b=-118.2```
  
3) If on of the following is true  
    - You're not hosting locally,
    - Your PHP server is not running on port 80,
    - calculate.php is not in your server root directory.
  
  You wull need to modify [vite.config.js](frontend/vite.config.js), specifically server proxy part. Exemplary modification:
```js
  proxy:{
    '/api': {
      target: 'http://localhost:80',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
```
to
```js
  proxy:{
    '/api': {
      target: 'your-dev-server.net:5000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '/path/to/calculate-php-file')
    }
  }
```
4) Run the development vite server
  ```
    cd frontend
    npm install
    npm run dev
  ```

## Tests
You can run tests with:
```bash
cd frontend
npm install
npm run test
```
  
## ---------------------------------------------------------

## To Do

After second thought, the `parseCoordinate` function should only parseCoordinate, not parse and rewrite.


`GeoCoordinate` should have another to refs:
- `inputChanged` (boolean) — initialized to `true`.
- `floatValue` (nullable float) — initialized to `null`.

and three public functions:
- `updateCoordinate()`  
  Called every time the input loses focus.  
  - Sets `inputChanged` to `false`.  
  - If the input is empty:
    - Displays the appropriate error message.
    - Sets `floatValue` to `null`.
    - Returns `null`.
  - Otherwise:
    - Parses the input using `parseCoordinate`.
    - Sets `floatValue` to the result.
    - If `floatValue` is `null`, shows an error and returns `null`.
    - If parsing is successful, formats the coordinate using `formatCoordinate` and updates the input text, Then iteturns the parsed coordinate.

- `getCoordinate()`  
  - If `inputChanged` is `false`, returns `floatValue`.
  - Otherwise:
    - Parses the input with `parseCoordinate`.
    - Sets or clears error messages accordingly.
    - Returns the parsed result.

- `inputChanged()`  
  - Called every time the user changes the input.
  - Sets `inputChanged` to `true`.


This way I'm not calling 'parseCoordinate' twice, code is simpler and faster, and I'm not breaking first SOLID rule.

