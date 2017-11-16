# Setup a Docker Machine on Azure Linux VM

## Commands
```
#Create the resource group for the services for your Docker machine
az group create \
    --name docker-machine-rg \
    --location eastus

#Create the Docker machine on Linux VM
docker-machine create \
    --driver azure \
    --azure-subscription-id TODO \
    --azure-image  "Canonical:UbuntuServer:14.04.5-LTS:latest" \
    --azure-size "Standard_D2_v2" \
    --azure-resource-group docker-machine-rg \
    --azure-location eastus \
    docker-machine

#To connect to your Docker host in Azure, define the appropriate connection settings
eval $(docker-machine env docker-machine --shell bash)

#If you need to stop this VM to save some money when you don't need it.
az vm stop \
    --name docker-machine-mabenoit \
    --resource-group docker-machine-mabenoit-rg

#If you need to start this VM if you previously stopped it.
az vm start \
    --name docker-machine-mabenoit \
    --resource-group docker-machine-mabenoit-rg
```

## Azure Pricing

TODO

## Resources

[How to use Docker Machine to create hosts in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/docker-machine)




