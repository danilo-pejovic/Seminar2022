FROM nginx:1.21-alpine

RUN mkdir /frontend
RUN mkdir /frontend/build
RUN mkdir /backend
RUN mkdir /backend/staticfiles
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d