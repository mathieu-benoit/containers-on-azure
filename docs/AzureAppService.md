# Deploy a Docker container on Azure App Service for Containers (AASC)

## Commands

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

#Optional parameters and default values for "az container create":
#--sku B1
#--number-of-workers 1

#Create your AASC Web App
az webapp create \
    -n <your-aasc-app> \
    -g <your-aasc-rg> \
    --plan <your-aasc-plan> \
    -i <dockerhub-username>/nodejs-helloworld

#Set ACR credentials
az webapp config container set \
    -n <your-aasc-app> \
    -g <your-aasc-rg> \
    -i <your-acr>.azurecr.io/nodejs-helloworld \
    -u <your-acr-user> \
    -r <your-acr>.azurecr.io \
    -p <your-acr-password>

#Set appsettings
az webapp config appsettings set \
    -g <your-aasc-rg> \
    -n <your-aasc-app> \
    --settings CONTAINER_HOST=AASC

#Optional connectionstrings settings could be set as well using: "az webapp config connection-string set"

#Restart your AASC (it could be one of the ways to update your webapp if you are referencing the latest tag for example)
az webapp restart \
    -n <your-aasc-app> \
    -g <your-aasc-rg>

#Configure logging for your AASC.
az webapp log config \
    -n <your-aasc-app> \
    -g <your-aasc-rg> \
    --docker-container-logging filesystem

#Get the logs of your AASC as a zip file
az webapp log download \
    -n <your-aasc-app> \
    -g <your-aasc-rg>

#Start live log tracing for your AASC
az webapp log tail \
    -n <your-aasc-app> \
    -g <your-aasc-rg>

#Scale up your AASC (change the sku/price)
#Note: you could setup auto-scaling as well.
az appservice plan update \
    --sku S1 \
    -n <your-aasc-app>

#Scale out your AASC (increase the number of instances/workers)
az appservice plan update \
    --number-of-workers 2 \
    -n <your-aasc-app>

#Delete your AASC plan (you could save some $$)
az appservice plan delete \
    --name <your-aasc-app> \
    --resource-group <your-aasc-rg>
```

## Notes

- Web App for Containers is a great way to host your custom containers on App Service
  - Remark: App Service on Linux is an alternative to deploy your web app on without building/bringing Containers, [see details here](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-intro).
- You could leverage key and managed App Service's features acting as an interesting orechestrator: Scale out and up, Slot, Ssl configuration, etc.
- You could configure SSH through the Kudu/SCM site [like explained here](https://docs.microsoft.com/azure/app-service/containers/tutorial-custom-docker-image#connect-to-web-app-for-containers-using-ssh).
- You could configure a web hook for continuous deployment [like explained here](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-ci-cd).
- There is some current limitations that should be mitigated in the near future:
  - Isolated or Premium SKU tier are not supported yet

## Resources

- [Web App for Containers service overview](https://azure.microsoft.com/services/app-service/containers/)
- [Web App for Containers service documentation](https://docs.microsoft.com/azure/app-service/containers/)
- [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/)
- [App Service CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/appservice)
- [Azure Web App CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/webapp)
- [Demo: Web App for Containers - Developer Finder](https://aka.ms/devfinder)
- Other labs:
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/Modules/ContainersOnAzureAppService
  - https://github.com/OSSCanada/microhackfest/tree/master/HOL/03_WebAppContainers