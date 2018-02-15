# Deploy a Docker container on Azure Container Instance (ACI)

## Commands

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
ACI=<your-aci-name>
LOC=<your-aci-location>
CONT=<your-container-name>

#Create the resource group for the services for your ACI
az group create \
    -l $LOC \
    -n $RG

#Create your ACI from DockerHub
az container create \
    -g $RG \
    -n $ACI \
    -l $LOC \
    --image <dockerhub-username>/$CONT \
    --ip-address public \
    --ports 80 443 \
    -e CONTAINER_HOST=ACI

#Create your ACI from ACR
az container create \
    -g $RG \
    -n $ACI \
    -l $LOC \
    --image <your-acr>.azurecr.io/$CONT \
    --registry-password <your-acr-password> \
    --ip-address public \
    --ports 80 443 \
    -e CONTAINER_HOST=ACI 

#Optional parameters and default values for "az container create":
#--cpu 1
#--memory 1.5
#--os-type Linux
#--restart-policy Always

#List all your ACIs within a resource group
az container list \
    -g $RG
    -o table

#Check the status of your ACI
az container show \
    -n $ACI \
    -g $RG

#Get the logs of your ACI
az container logs \
    -n $ACI \
    -g $RG \
    --container-name $CONT

#Delete your ACI (you could save some $$)
az container delete \
    -n $ACI \
    -g $RG
```

## Notes

- ACI is currently in Preview
- ACI supports both Windows and Linux
- ACI is really great for a fast Docker container deployment and for on-demand process. It's goal is not very to host long-running process like web app or web api, [checkout how it's pricing works](https://azure.microsoft.com/pricing/details/container-instances/).
- ACI is for a single container per instance, [it does not cover the higher-value services that are provided by Container Orchestrator](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-orchestrator-relationship)
- Make sure you understand the [ACI's restart policy setting](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy)
- ACI doesn't provide for now a mechanism to redeploy/update a container instance - (see associated user voice)[https://feedback.azure.com/forums/602224-azure-container-instances/suggestions/32175820-allow-an-aci-container-to-update-itself-when-the-i] - you should recreate your container/container group with a new IP address
- ACI doesn't support for now scale capabilities (i.e. increasing the number of instances for one Container Instance)
- ACI doesn't support for now ssh connection like asked [here](https://feedback.azure.com/forums/602224-azure-container-instances/suggestions/32426185-open-shell-to-container).

## Resources

- [ACI service overview](https://azure.microsoft.com/services/container-instances/)
- [ACI service documentation](https://docs.microsoft.com/azure/container-instances/)
- [ACI pricing](https://azure.microsoft.com/pricing/details/container-instances/)
- [ACI CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/container)
- [ACI PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.containerinstance/#container_instances)
- Other labs:
  - https://github.com/Microsoft/MTC_ContainerCamp/blob/master/modules/azurecontainerinstances/aci.md#task-4-deploy-to-azure-container-instance