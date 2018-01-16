# General Docker commands

## Commands

```
#To build a Docker container locally
docker build -t <your-docker-registry-username>/<your-image-name> .

#To login to Docker Hub, user and password will be asked
docker login

#To logout from your previous login command
docker logout

#To login to Azure Container Registry (ACR), user and password will be asked
#See how to retrieve your ACR loginserver, username and password [here](./AzureContainerRegistry.md)
docker login <your-acr-loginserver>

#To push your local Docker image in your Docker registry
docker push <your-docker-registry-username>/<your-image-name>

#To rename your local Docker image
docker tag <previous-prefix>/<your-image-name> <new-prefix>/<your-image-name>

#To remove a local Docker image
docker rmi <image-id>
```

## Resources

- [Dockerizing a .NET Core web app](https://docs.docker.com/engine/examples/dotnetcore/)
- [Dockerizing a Node.js web app](https://nodejs.org/docs/guides/nodejs-docker-webapp/)