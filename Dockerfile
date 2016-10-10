FROM node:latest

RUN groupadd -g 1000 nonrootuser \
  && useradd -d "/home/nonrootuser" -u 1000 -g 1000 -m -s /bin/bash nonrootuser
USER nonrootuser

ADD . /usr/local/node

WORKDIR /usr/local/node

RUN mv config/k8Config.js config/instance-config.js

CMD /usr/local/bin/node app.js --logger=console

