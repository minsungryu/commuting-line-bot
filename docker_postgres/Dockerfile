FROM postgres:11.1

ENV POSTGRES_DB alarm_service
ENV POSTGRES_USER line_alarm_bot
ENV POSTGRES_PASSWORD dbalstjd99

COPY schema_init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432