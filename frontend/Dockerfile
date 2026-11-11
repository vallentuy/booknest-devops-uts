# Container 1: web server Nginx untuk frontend statis dan reverse proxy /api
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css app.js /usr/share/nginx/html/
EXPOSE 80
