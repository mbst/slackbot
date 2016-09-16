FROM node

ADD . /usr/local/node

WORKDIR /usr/local/node

RUN mv config/k8Config.js config/instance-config.js

CMD /usr/local/bin/node app.js

