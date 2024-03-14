#!/bin/bash

echo "Building React Files"
cd client
npm run build

echo "Now starting Flask server"
cd ..
flask run --host=0.0.0.0 --port=3000