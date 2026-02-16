FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY index.html style.css app.js /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 3006
