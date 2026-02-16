# Multi-stage build for apartment choice simulator
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy our static files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Copy custom nginx config to listen on PORT env variable
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port (Railway sets PORT env var)
EXPOSE ${PORT:-3006}

# nginx with envsubst to replace PORT in config
CMD ["/bin/sh", "-c", "envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
