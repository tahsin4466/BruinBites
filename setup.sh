#!/bin/bash

# 1. Install Python dependencies from requirements.txt
echo "Installing Python dependencies..."
if pip3 install -r requirements.txt; then
  echo "Dependencies installed successfully using pip3."
else
  echo "pip3 not found, trying with pip..."
  if pip install -r requirements.txt; then
    echo "Dependencies installed successfully using pip."
  else
    echo "Failed to install dependencies using both pip and pip3."
  fi
fi

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
python3 app.py
