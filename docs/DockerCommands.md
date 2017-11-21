docker build -t mabenoit/nodejs-helloworld .
docker login
docker push mabenoit/nodejs-helloworld

docker rmi <image-id>