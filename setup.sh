#!/bin/bash

# 1. Install Python dependencies from requirements.txt
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# 2. Change directory to the 'client'
echo "Changing directory to client..."
cd client

# 3. Install npm packages with force option
echo "Installing npm packages..."
npm install --force

# 4. Build the project using npm
echo "Building the project..."
npm run build

# 5. Change directory back to the root
echo "Changing directory back to root..."
cd ..

# 6. Run the Python application
echo "Running Python application..."
python3 app.p
