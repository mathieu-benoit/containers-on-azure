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

#Create your AASC Web App
az webapp create \
    -n <your-aasc-app> \
    -g <your-aasc-rg> \
    --plan <your-aasc-plan> \
    -i <dockerhub-username>/nodejs-helloworld

#Set ACR credentials
az webapp config container set 
    -n webapplinux-mabenoit-app 
    -g webapplinux-mabenoit-rg 
    -i <your-acr>.azurecr.io/nodejs-helloworld 
    -u <your-acr-user> 
    -r <your-acr>.azurecr.io 
    -p <your-acr-password>


    -e CONTAINER_HOST=ACI 

#Optional parameters and default values for "az container create":
#--cpu 1
#--memory 1.5

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

- Web App for Containers is a great way to host your custom containers on App Service
  - Remark: App Service on Linux is an alternative to deploy your web app on without building/bringing Containers, [see details here](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-intro).
- You could leverage key and managed App Service's features such as:
  - Scale out and up
  - Slot
- You could configure SSH through the Kudu/SCM site [like explained here](https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image#connect-to-web-app-for-containers-using-ssh).
- There is some current limitations that should be mitigated in the near future:
  - Isolated or Premium SKU tier are not supported yet

## Resources

- [Web App for Containers service overview](https://azure.microsoft.com/services/app-service/containers/)
- [Web App for Containers service documentation](https://docs.microsoft.com/azure/app-service/containers/)
- [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/)
- [App Service CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/appservice)
- [Azure Web App CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/webapp)