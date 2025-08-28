#!/bin/bash

# Remove all mobile CSS media queries and related content from index.html

# Remove lines containing mobile-related media queries and surrounding content
sed -i '/\/\* Mobile-only layout changes \*\//,/^[[:space:]]*}[[:space:]]*$/d' index.html
sed -i '/@media (max-width: 768px)/,/^[[:space:]]*}[[:space:]]*$/d' index.html
sed -i '/@media (min-width: 769px)/,/^[[:space:]]*}[[:space:]]*$/d' index.html
sed -i '/\/\* Products Section - Mobile Only Optimizations \*\//,/^[[:space:]]*}[[:space:]]*$/d' index.html
sed -i '/COMPREHENSIVE MOBILE OPTIMIZATION/,/^[[:space:]]*\*\//d' index.html
sed -i '/Mobile Optimizations for New\/Updated Sections/,/^[[:space:]]*}[[:space:]]*$/d' index.html
sed -i '/Mobile Container Optimizations/,/^[[:space:]]*}[[:space:]]*$/d' index.html

# Remove any remaining mobile-related comments and single-line rules
sed -i '/\/\*.*[Mm]obile.*\*\//d' index.html
sed -i '/[Mm]obile.*optimization/d' index.html
sed -i '/[Mm]obile.*friendly/d' index.html

echo "Mobile CSS removal completed"
