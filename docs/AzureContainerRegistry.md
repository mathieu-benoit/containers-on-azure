# Play with Azure Container Registry (ACR)

- [Commands](#commands)
- [Notes](#notes)
- [Resources](#resources)

## Commands

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
ACR=<your-acr-name>
LOC=<your-acr-location>

#Create the resource group for the services for your ACR
az group create \
    -l $LOC \
    -n $RG

#Create your ACR
az acr create \
    --admin-enabled \
    --sku Basic \
    --verbose \
    -l $LOC \
    -n $ACR \
    -g $RG

#Show the info of your ACR
az acr show \
    -n $ACR

#Get your ACR's loginServer
az acr show \
    -n $ACR \
    --query loginServer

#Get your ACR's username
az acr credential show \
    -n $ACR \
    --query "username"

#Get your ACR's password
az acr credential show \
    -n $ACR \
    --query "passwords[0].value"

#Show usage of your ACR
az acr show-usage \
    -n $ACR

#Build an image by providing the code source (located in "." folder in the example below)
az acr build \
    --registry $ACR \
    --image <your-image-name>:<your-tag> \
    .

#Get the list of the repositories within your ACR
az acr repository list \
    -n $ACR

#Get tags of a repository within your ACR
az acr repository show-tags \
    -n $ACR \
    --repository <repository-name>

#Create a continuous integration build-task with GitHub
az acr build-task create \
    --registry $ACR \
    --name <build-task-name> \
    --image<your-image-name>:{{.Build.ID}} \
    --context <github-repository> \
    --branch master \
    --git-access-token <github-pat>

#Run a specific build-task
az acr build-task run \
    --registry $ACR \
    --name <build-task-name>

#View a build-task status and logs
az acr build-task logs \
    --registry $ACR

#List your ACR builds
az acr build-task list-builds \
    --registry $ACR \
    --output table
```

## Notes

- ACR is a great alternative to DockerHub for your private and enterprise containers registries
- ACR has Geo-replication capabilities (in Preview) like explained [here](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-geo-replication)
- ACR has Build capabilities (in Preview) like explained [here](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-build-overview), you could furthermore easily [setup a base images update build](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-base-image-update).

## Resources

- [ACR service overview](https://azure.microsoft.com/services/container-registry/)
- [ACR service documentation](https://docs.microsoft.com/azure/container-registry/)
- [ACR pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [ACR CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/acr)
- [ACR Best practice](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices)
- [ACR FAQ](https://github.com/Azure/acr/blob/master/docs/FAQ.md)
