#!/bin/bash

# Firebase Storage CORS Fix Script
# This script helps you configure CORS for Firebase Storage

echo "🔧 Firebase Storage CORS Configuration Fix"
echo "=========================================="

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil is not installed. Please install Google Cloud SDK first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gsutil ls &> /dev/null; then
    echo "❌ Not authenticated with Google Cloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

echo "✅ gsutil is installed and authenticated"

# Detect the correct bucket name
echo ""
echo "🔍 Detecting Firebase Storage bucket..."

# Try different possible bucket names
BUCKETS=(
    "techedu-solution.firebasestorage.app"
    "techedu-solution.appspot.com"
)

CORRECT_BUCKET=""
for bucket in "${BUCKETS[@]}"; do
    if gsutil ls gs://$bucket &> /dev/null; then
        CORRECT_BUCKET=$bucket
        echo "✅ Found bucket: gs://$bucket"
        break
    fi
done

if [ -z "$CORRECT_BUCKET" ]; then
    echo "❌ Could not find your Firebase Storage bucket."
    echo "   Please check your Firebase project settings and ensure the bucket exists."
    echo "   Common bucket names:"
    for bucket in "${BUCKETS[@]}"; do
        echo "   - gs://$bucket"
    done
    exit 1
fi

# Create CORS configuration
echo ""
echo "📝 Creating CORS configuration..."

cat > firebase-cors-config.json << EOF
[
  {
    "origin": [
      "https://tech-eduk.com",
      "https://www.tech-eduk.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers"
    ]
  }
]
EOF

echo "✅ CORS configuration created: firebase-cors-config.json"

# Apply CORS configuration
echo ""
echo "🚀 Applying CORS configuration to gs://$CORRECT_BUCKET..."

if gsutil cors set firebase-cors-config.json gs://$CORRECT_BUCKET; then
    echo "✅ CORS configuration applied successfully!"
else
    echo "❌ Failed to apply CORS configuration."
    echo "   Please check your permissions and try again."
    exit 1
fi

# Verify CORS configuration
echo ""
echo "🔍 Verifying CORS configuration..."

if gsutil cors get gs://$CORRECT_BUCKET; then
    echo "✅ CORS configuration verified!"
else
    echo "❌ Failed to verify CORS configuration."
    exit 1
fi

echo ""
echo "🎉 CORS configuration complete!"
echo ""
echo "Next steps:"
echo "1. Wait 5-10 minutes for changes to propagate"
echo "2. Clear your browser cache"
echo "3. Test file uploads in your application"
echo "4. Check browser console for any remaining errors"
echo ""
echo "If you still have issues:"
echo "- Check that your domain is correctly listed in the CORS origins"
echo "- Verify your Firebase project settings"
echo "- Test with incognito/private browsing mode"
