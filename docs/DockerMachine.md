# Setup a Docker Machine on Azure Linux VM

## Commands
```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
MACH=<your-docker-machine-name>
LOC=<your-docker-machine-location>

#Create the resource group for the services for your Docker machine
az group create \
    --name $RG \
    --location $LOC

#Create the Docker machine on Linux VM
docker-machine create \
    --driver azure \
    --azure-subscription-id <your-subscription-id> \
    --azure-image  "Canonical:UbuntuServer:14.04.5-LTS:latest" \
    --azure-size "Standard_D2_v2" \
    --azure-resource-group $RG \
    --azure-location $LOC \
    $MACH

#To connect to your Docker host in Azure, define the appropriate connection settings
eval $(docker-machine env $MACH --shell bash)

#If you need to deallocate/stop this VM to save some money when you don't need it
#/!\ Important remark: when you will start back this VM, its IP address will be regenerated (unless you have static IP address for your VM). Furthermore, you will need to run the "docker-machine regenerate-certs" command, see below.
az vm deallocate \
    --name $MACH \
    --resource-group $RG

#If you need to start this VM previously stopped
az vm start \
    --name $MACH \
    --resource-group $RG

#If you need to regenerate your docker-machine certs. 
#/!\ Important remark: be advised that this will trigger a Docker daemon restart which might stop running containers.
docker-machine regenerate-certs $MACH
```

## Azure Pricing

TODO

## Resources

[How to use Docker Machine to create hosts in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/docker-machine)