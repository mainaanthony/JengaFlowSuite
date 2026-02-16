#!/bin/sh
set -e

echo "Checking and installing dependencies..."
npm install

echo "Starting Angular development server..."
exec npm start
