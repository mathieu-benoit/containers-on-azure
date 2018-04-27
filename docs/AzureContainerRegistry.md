# Play with Azure Container Registry (ACR)

## Commands

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
ACR=<your-acr-name>
LOC=<your-acr-location>
REPO=<your-acr-repo>

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

#Get your ACR's loginServer
az acr show \
    -n $ACR \
    --query loginServer

#Get your ACR's password
az acr credential show \
    -n $ACR \
    --query "passwords[0].value"

#Get the list of the repositories within your ACR
az acr repository list \
    -n $ACR

#Get tags of a repository within your ACR
az acr repository show-tags \
    -n $ACR \
    --repository $REPO
```

## Notes

- ACR is a great alternative to DockerHub for your private and enterprise containers registries

## Resources

- [ACR service overview](https://azure.microsoft.com/services/container-registry/)
- [ACR service documentation](https://docs.microsoft.com/azure/container-registry/)
- [ACR pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [ACR CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/acr)