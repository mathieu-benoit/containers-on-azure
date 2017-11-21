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
    --azure-subscription-id <your-subscription-id> \
    --azure-image  "Canonical:UbuntuServer:14.04.5-LTS:latest" \
    --azure-size "Standard_D2_v2" \
    --azure-resource-group docker-machine-rg \
    --azure-location eastus \
    docker-machine

#To connect to your Docker host in Azure, define the appropriate connection settings
eval $(docker-machine env docker-machine --shell bash)

#If you need to deallocate/stop this VM to save some money when you don't need it
#/!\ Important remark: when you will start back this VM, its IP address will be regenerated (unless you have static IP address for your VM). Furthermore, you will need to run the "docker-machine regenerate-certs" command, see below.
az vm deallocate \
    --name docker-machine \
    --resource-group docker-machine-rg

#If you need to start this VM previously stopped
az vm start \
    --name docker-machine-mabenoit \
    --resource-group docker-machine-mabenoit-rg

#If you need to regenerate your docker-machine certs. 
#/!\ Important remark: be advised that this will trigger a Docker daemon restart which might stop running containers.
docker-machine regenerate-certs docker-machine
```

## Azure Pricing

TODO

## Resources

[How to use Docker Machine to create hosts in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/docker-machine)