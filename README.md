# BruinBites

## Overview
This is a web application that helps UCLA students find the best eats on campus! Users will be able to create an account with UCLA SSO, rate their favorite places and interact with other students' feedback for all dining establishments. Live data will also be pulled from menu.dining.ucla.edu for a one stop place for all dining info.

This project is being built using a Flask backend and a React front end with MUI. A MySQL server hosted on AWS will faciliate dynamic data storage and retrieval. It is part of a collaborative project for CS35L - Software Construction.

## Installation
NOTE: You MUST have a special `.env` file in order to have access credentials for the MySQL and CDN server. Without it, this application will not run. When you have access to this, place it in the `BruinBites` root directory.

Make sure you have the latest version of Python installed (preferabbly 3.12+). You will also need to install node.js on your machine for access to npm.

This project requires multiple dependencies to work, including Flask. While in the `BruinBites` root directory, install all the dependencies found in the `requirements.txt` file using:

```
pip install -r requirements.txt
```

If you have a Linux operating system, use `pip3` instead of `pip` to install the above.

Then, make sure to have Flask configured to target the file `app.py`.

This project also uses React and is written in TypeScript. Once node.js is installed, navigate to the `client` directory first and install all dependencies using:
```
npm install
```

If you have any errors, you can also use:

```
npm install --force
```

Then, build the front-end using:
```
npm run build
```

Run `app.py`, and you will see a local IP on port 5000 pop up in the terminal. Press the link to open the web application in your browser. If you're modifying the front-end, make sure to run `npm run build` first to reload the TS/TSX documents before starting the Flask server.

If you want, you can also start the React development environment for front-end testing. To do so, run:

```
npm start
```

Note that this will most likely break the site! For full functionality, we recommend running the full stack application

