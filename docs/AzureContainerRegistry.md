# Create an Azure Container Registry (ACR)

## Commands

```
#Create the resource group for the services for your ACR
az group create \
    -l eastus \
    -n <your-acr-rg>

#Create your ACR
az acr create \
    --admin-enabled \
    --sku Basic \
    --verbose \
    -l westus \
    -n <your-acr> \
    -g <your-acr-rg>

#Get your ACR's loginServer
az acr show \
    -n <your-acr> \
    --query loginServer

#Get your ACR's password
az acr credential show \
    -n <your-acr> \
    --query "passwords[0].value"

#Get the list of the repositories within your ACR
az acr repository list \
    -n <your-acr>

#Get tags of a repository within your ACR
az acr repository show-tags \
    -n <your-acr> \
    --repository <your-acr-repo>
```

## Notes

- ACR is a great alternative to DockerHub for your private and enterprise containers registries

## Resources

- [ACR service overview](https://azure.microsoft.com/services/container-registry/)
- [ACR service documentation](https://docs.microsoft.com/azure/container-registry/)
- [ACR pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [ACR CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/acr)