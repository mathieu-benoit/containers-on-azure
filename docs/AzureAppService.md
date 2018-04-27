# Play with Azure App Service for Containers (AASC)

## Commands

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
AASC=<your-aasc-name>
LOC=<your-aasc-location>

#Create the resource group for the services for your AASC
az group create \
    -l $LOC \
    -n <your-aasc-rg>

#Create your AASC App Service Plan with Container on Linux support
az appservice plan create \
    -g $RG \
    -n $AASC \
    -l $LOC \
    --is-linux

#Optional parameters and default values for "az container create":
#--sku B1
#--number-of-workers 1

#Create your AASC Web App
az webapp create \
    -n $AASC \
    -g $RG \
    --plan $AASC \
    -i <dockerhub-username>/nodejs-helloworld

#Set ACR credentials
az webapp config container set \
    -n $AASC \
    -g $RG \
    -i <your-acr>.azurecr.io/nodejs-helloworld \
    -u <your-acr-user> \
    -r <your-acr>.azurecr.io \
    -p <your-acr-password>

#Set appsettings
az webapp config appsettings set \
    -g $RG \
    -n $AASC \
    --settings CONTAINER_HOST=AASC

#Optional connectionstrings settings could be set as well using: "az webapp config connection-string set"

#Restart your AASC (it could be one of the ways to update your webapp if you are referencing the latest tag for example)
az webapp restart \
    -n $AASC \
    -g $RG

#Configure logging for your AASC.
az webapp log config \
    -n $AASC \
    -g $RG \
    --docker-container-logging filesystem

#Get the logs of your AASC as a zip file
az webapp log download \
    -n $AASC \
    -g $RG

#Start live log tracing for your AASC
az webapp log tail \
    -n $AASC \
    -g $RG

#Scale up your AASC (change the sku/price)
az appservice plan update \
    --sku S1 \
    -n $AASC

#Scale out your AASC (increase the number of instances/workers)
#Rk: the price won't be the same, it will be multiply by X if X is the number-of-workers
az appservice plan update \
    --number-of-workers 2 \
    -n $AASC

#Delete your AASC plan (you could save some $$)
az appservice plan delete \
    --name $AASC \
    --resource-group $RG
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