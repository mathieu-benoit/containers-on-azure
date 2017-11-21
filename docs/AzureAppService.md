# Deploy a Docker container on Azure App Service for Containers (AASC)

## Commands



az webapp config container set -n webapplinux-mabenoit-app -g webapplinux-mabenoit-rg -i acrmabenoitregistry.azurecr.io/nodejs-helloworld -u acrmabenoitregistry -r acrmabenoitregistry.azurecr.io -p wDybyJCLH/7eMRIlNSvym3RhY4t8375B

```
#Create the resource group for the services for your AASC
az group create \
    -l eastus \
    -n <your-aasc-rg>

#Create your AASC App Service Plan
az appservice plan create \
    -g <your-aasc-rg> \
    -n <your-aasc-plan> \
    --is-linux

#Create your AASC Web App
az webapp create \
    -n <your-aasc-app> \
    -g <your-aasc-rg> \
    --plan <your-aasc-plan> \
    -i <dockerhub-username>/nodejs-helloworld




    --image <your-acr>.azurecr.io/nodejs-helloworld \
    --registry-password <your-acr-password> \
    -e CONTAINER_HOST=ACI 

#Optional parameters and default values for "az container create":
#--cpu 1
#--memory 1.5
#--os-type Linux
#--restart-policy Always

#Check the status of your ACI
az container show \
    --name <your-aci> \
    --resource-group <your-aci-rg>

#Get the logs of your ACI
az container logs \
    --name <your-aci> \
    --resource-group <your-aci-rg>

#Delete your ACI (you could save some $$)
az container delete \
    --name <your-aci> \
    --resource-group <your-aci-rg>
```

## Notes

- TODO

## Resources

- [Web App for Containers service overview](https://azure.microsoft.com/services/app-service/containers/)
- [Web App for Containers service documentation](https://docs.microsoft.com/en-us/azure/app-service/containers/)
- [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/)
- [App Service CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/appservice)
- [Azure Web App CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/webapp)