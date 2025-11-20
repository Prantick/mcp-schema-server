#!/bin/bash

# Pre-publish checklist script

echo "🔍 Running pre-publish checks..."

# Check if build succeeds
echo "✓ Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Check if dist folder has required files
echo "✓ Checking dist files..."
if [ ! -f "dist/index.js" ] || [ ! -f "dist/index.d.ts" ]; then
  echo "❌ Missing required dist files"
  exit 1
fi

# Check if package.json is valid
echo "✓ Validating package.json..."
npm pkg get name version main types > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Invalid package.json"
  exit 1
fi

# Check if README exists
echo "✓ Checking documentation..."
if [ ! -f "README.md" ] || [ ! -f "LICENSE" ]; then
  echo "❌ Missing documentation files"
  exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Ready to publish. Run: npm publish"
echo ""
echo "📝 Don't forget to:"
echo "  - Update version in package.json"
echo "  - Update CHANGELOG.md"
echo "  - Commit and tag the release"
echo "  - Push to repository"
