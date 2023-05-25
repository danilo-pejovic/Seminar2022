FROM python:3.9.14-alpine3.16



ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir backend



# Adding backend directory to make absolute filepaths consistent across services
WORKDIR /backend


RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

COPY ./requirements_prod.txt ./requirements_prod.txt
RUN pip install --upgrade pip
RUN pip install -r requirements_prod.txt

# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/entrypoint.sh
RUN sed -i 's/\r$//g' /usr/src/entrypoint.sh
RUN chmod +x /usr/src/entrypoint.sh

# run entrypoint.sh
RUN echo ls -l
ENTRYPOINT ["/usr/src/entrypoint.sh"]