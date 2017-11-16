# Create an Azure Container Registry (ACR)

## Commands

```
#Create the resource group for the services for your ACR
az group create \
    -l eastus \
    -n <your-acr-rg>

#Create your ACR
#Duration: TODO
az acr create \
    --admin-enabled \
    --sku Basic \
    --verbose \
    -l westus \
    -n <your-acr> \
    -g <your-acr-rg>

#Get your ACR's loginServer
az acr show \
    --name <your-acr> \
    --query loginServer

#Get your ACR's password
az acr credential show \
    --name <your-acr> \
    --query "passwords[0].value"
```

## Azure Pricing

TODO

## Resources

- [ACR service overview](https://azure.microsoft.com/services/container-registry/)
- [ACR service documentation](https://docs.microsoft.com/azure/container-registry/)
- [ACR pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [ACR CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/acr)