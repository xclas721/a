############################
# 1) Frontend build
############################
FROM node:22-alpine AS build
WORKDIR /app

ARG DEBUG=1

COPY package*.json ./
RUN npm ci

RUN if [ "$DEBUG" = "1" ]; then \
      echo "=== after npm ci ===" && ls -al && \
      echo "=== node_modules (head) ===" && ls -al node_modules | head -50 && \
      node -v && npm -v; \
    fi

COPY . .
RUN npm run build:docker

RUN if [ "$DEBUG" = "1" ]; then \
      echo "=== dist ===" && du -sh dist || true && \
      find dist -type f | sed -n '1,200p'; \
    fi


############################
# 2) Build headers_more as dynamic module for this nginx version
############################
FROM alpine:3.20 AS headers_more_build

# Must match the nginx version used inside nginx:1.29-alpine
# Check with: docker run --rm nginx:1.29-alpine nginx -v
ARG NGINX_VERSION=1.29.3

RUN apk add --no-cache \
      build-base \
      pcre-dev \
      zlib-dev \
      openssl-dev \
      curl \
      git

WORKDIR /tmp

# Download nginx source
RUN curl -LO http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar xzf nginx-${NGINX_VERSION}.tar.gz

# Download headers_more module
RUN git clone https://github.com/openresty/headers-more-nginx-module.git

WORKDIR /tmp/nginx-${NGINX_VERSION}

# Build dynamic module
RUN ./configure \
      --with-compat \
      --add-dynamic-module=../headers-more-nginx-module \
    && make modules

# Keep only the module .so
RUN mv objs/ngx_http_headers_more_filter_module.so /tmp/ngx_http_headers_more_filter_module.so


############################
# 3) Runtime: official nginx + module + SPA
############################
FROM nginx:1.29-alpine

# DO NOT install nginx-mod-* via apk here – different build, causes version mismatch
# RUN apk add --no-cache nginx-mod-http-headers-more   # <- remove this

ENV PORT=8080

# Copy headers_more module built above
COPY --from=headers_more_build /tmp/ngx_http_headers_more_filter_module.so /etc/nginx/modules/

# Custom nginx.conf (loads module + clears Server header)
COPY infra/nginx.conf /etc/nginx/nginx.conf

# Built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx templating: render default.conf from template at container start
COPY infra/default.conf.template /etc/nginx/templates/default.conf.template

# Runtime config injector
COPY infra/50-runtime-env.sh /docker-entrypoint.d/50-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/50-runtime-env.sh

EXPOSE 8080
