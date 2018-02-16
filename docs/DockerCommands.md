# General Docker commands

## Commands

```
#The following variables will be used within the scope of the commands illustrated below:
IMG=<your-container-image-name>
USER=<your-docker-registry-username>

#To build a Docker container locally
docker build -t $IMG .

#To rename a Docker container
docker tag $IMG $USER/$IMG

#To list the Docker containers images
docker images

#To login to Docker Hub, user and password will be asked
docker login

#To logout from your previous login command
docker logout

#To login to Azure Container Registry (ACR), user and password will be asked
#See how to retrieve your ACR loginserver, username and password [here](./AzureContainerRegistry.md)
docker login <your-acr-loginserver>

#To push your local Docker image in your Docker registry
docker push $USER/$IMG

#To remove a local Docker image
docker rmi <image-id>

#To run locally a Docker container
docker run -d --name $IMG $IMG

#To list the Docker containers instances
docker ps

#To open a bash session from within the Docker container
#Rk: type exit then to exit the bash session.
docker exec -it $IMG bash
```

## Resources

- [Dockerizing a .NET Core web app](https://docs.docker.com/engine/examples/dotnetcore/)
- [Dockerizing a Node.js web app](https://nodejs.org/docs/guides/nodejs-docker-webapp/)