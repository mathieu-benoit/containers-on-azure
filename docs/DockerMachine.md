# Setup a Docker Machine

## Azure Linux Docker Machine
```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
VM=<your-docker-machine-name>
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
    $VM

#To connect to your Docker host in Azure, define the appropriate connection settings
eval $(docker-machine env $VM --shell bash)

#If you need to deallocate/stop this VM to save some money when you don't need it
#/!\ Important remark: when you will start back this VM, its IP address will be regenerated (unless you have static IP address for your VM). Furthermore, you will need to run the "docker-machine regenerate-certs" command, see below.
az vm deallocate \
    --name $VM \
    --resource-group $RG

#If you need to start this VM previously stopped
az vm start \
    --name $VM \
    --resource-group $RG

#If you need to regenerate your docker-machine certs. 
#/!\ Important remark: be advised that this will trigger a Docker daemon restart which might stop running containers.
docker-machine regenerate-certs $VM
```

## Azure Linux VM (Ubuntu) with the Docker extension

```
#Create the UbuntuLTS VM
az vm create \
  -n $VM \
  -g $RG \
  --image UbuntuLTS \
  --size Standard_D2_v2

#Install Docker
az vm extension set \
  --vm-name $NAME \
  -g $RG \
  --name DockerExtension \
  --publisher Microsoft.Azure.Extensions \
  --version 1.2.2

#Open ports (if needed)
az vm open-port \
  --name $NAME \
  -g $RG \
  --port 25575

#SSH into machine and run docker command
ssh <your-username>:<machine-ip>
```

## Azure Windows Server VM with Containers

```
#Create the WindowsServer with Containers VM
az vm create \
  -n $NAME \
  -g $RG \
  --image MicrosoftWindowsServer:WindowsServer:2016-Datacenter-with-Containers:latest

#Open ports (if needed)
az vm open-port \
  --name $NAME \
  -g $RG \
  --port 25575

# + to RDP
```

## Resources

[How to use Docker Machine to create hosts in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/docker-machine)