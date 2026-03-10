#!/bin/sh
set -eu


# Generate a JS runtime configuration the app can read without rebuilding
cat >/usr/share/nginx/html/app-config.js <<'EOF'
window.__APP_CONFIG__ = {
API_BASE_URL: "${VUE_API_BASE_URL}",
FRONTEND_CONTEXT_PATH: "${VUE_FRONTEND_CONTEXT_PATH}",
FRONTEND_PORT: "${VUE_FRONTEND_PORT}",
BACKEND_API_TIMEOUT: "${VUE_BACKEND_API_TIMEOUT}",
PAGE_SIZE: "${VUE_PAGE_SIZE}",
STAGE: "${STAGE}",
SYSTEM_ID: "${VITE_SYSTEM_ID}",
BACKEND_CONTEXT_PATH: "${VITE_BACKEND_CONTEXT_PATH}"
};
EOF


# Expand env vars into the JS file safely
envsubst < /usr/share/nginx/html/app-config.js > /usr/share/nginx/html/app-config.js.tmp \
&& mv /usr/share/nginx/html/app-config.js.tmp /usr/share/nginx/html/app-config.js