# Play with Azure Managed Kubernetes (AKS)

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
AKS=<your-aks-name>
LOC=<your-aks-location>
IMG=<your-docker-image-name>
```

## Commands for managing your Kubernetes cluster

```
#Create the resource group for the services for your AKS
az group create \
    -l $LOC \
    -n $RG

#Get the Kubernetes versions available for creating a Kubernetes cluster in a specific location
az aks get-versions \
  -l $LOC \
  -o table

#Create the ACS cluster with Kubernetes as the orchestrator (~ 10 mins)
az aks create \
    -g $RG \
    -n $AKS \
    -l $LOC \
    --generate-ssh-keys

#Optional parameters and default values for "az aks create":
#--no-wait
#--node-count 3
#--kubernetes-version 1.8.11
#--admin-username azureuser
#--ssh-key-value ~.sshid_rsa.pub
#--service-principal --> see details [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal).

#You could see the detail of the resources deployed in 2 resource groups you have now:
#To see the deployment entries history of your resource group and grab the deployment name:
az group deployment list \
  -g $RG \
  -o table
#To see the AKS resource itself:
az group deployment operation list \
  -g $RG \
  -n <deployment-name> \
  --query '[].{resource:properties.targetResource.resourceType}' \
  -o table
#To see the deployment entries history of your AKS agent nodes resource group auto-created when you provisioned 
az group deployment operation list \
  -g MC_$RG_$AKS_$LOC \
  -n <deployment-name> \
  --query '[].{resource:properties.targetResource.resourceType}' \
  -o table
#To see the Azure resources actually deployed for your AKS agent nodes
az group deployment operation list \
  -g $RG \
  -n <deployment-name>

#Get the information of your AKS
az aks show \
    -n $AKS \
    -g $RG \
    -o table

#Get the cluster credentials
az aks get-credentials \
    -g $RG \
    -n $AKS

#Get the current config/cluster credentials
kubectl config current-context

#Install kubectl if not yet installed
#Rk: you could check if it's installed with "kubectl version"
az aks install-cli

#Access Kubernetes control panel (not working with Azure Cloud Shell), then access the url
az aks browse \
    -g $RG \
    -n $AKS

#Get the nodes of the Kubernetes cluster
#Rk: while deploying and to watch these information you could prefix this command with "watch", i.e. "watch kubectl get nodes", CTRL+C to exit.
kubectl get nodes

#Get more details about your cluster
kubectl cluster-info

#Scale out the number of nodes (i.e. number of VMs) within your cluster (~ 10 mins)
az aks scale \
    -g $RG \
    -n $AKS \
    --node-count 4

#Get the Kubernetes versions available for upgrading your Kubernetes cluster
az aks get-upgrades \
    -n $AKS \
    -g $RG \
    -o table

#Upgrade the version of your Kubernetes cluster
az aks upgrade \
    -n $AKS \
    -g $RG \
    --kubernetes-version 1.8.7

#Setup AKS with access to Azure Container Registry
kubectl create secret docker-registry acr-secret \
    --docker-server=$ACR_SERVER \
    --docker-username=$ACR_USER \
    --docker-password=$ACR_PWD \
    --docker-email=superman@heroes.com
```

## Commands for deploying, interacting and managing your pods and services

### General commands for interacting and managing your pods and services

```
#List the pods
#Rk: add a " | grep XXX" at the end of this command to only list the pods containing XXX in the name
#Other rk: "kubectl get pod" works as well for the same purpose
kubectl get pods

#Get the information for a specific pod
kubectl describe pod <pod-name>

#Get logs of a specific pod
kubectl logs <pod-name>

#Open a bash session to execute commands in a specific pod
kubectl exec \
    -it <pod-name> bash

#List the services
#Rk: add a " | grep XXX" at the end of this command to only list the services containing XXX in the name
#Other rk: "kubectl get service" works as well for the same purpose
kubectl get svc

#Get service info + watch for update, useful for external-ip assignment for example
kubectl get svc $IMG \
    --watch

#Get the information for a specific svc
kubectl describe svc <svc-name>

#Delete a pod, service, deployment by their yaml file
kubectl delete \
    -f aks-deploy.yml

#Delete a pod
kubectl delete pod <pod-name>

#Delete a svc
kubectl delete svc <svc-name>
```

### Commands for creating a pod/service by running a docker image

```
#Run a Docker image in the Kubernetes cluster
kubectl run <deployment-name> \
  --image $IMG \
  --port 80 \
  --env CONTAINER_HOST=AKS

#Note: after running this command you should see associated entries with "kubectl get pods" and "kubectl get deploy"

#Expose the instance to the world via Azure Load Balancer (this will take a few minutes)
kubectl expose deployment <deployment-name> \
  --port 80 \
  --type LoadBalancer

#Watch the service to get the external IP as it's provisioned
kubectl get svc <deployment-name> -w

#Edit the deployment deployed
kubectl edit deploy <deployment-name>

#Edit the service deployed
kubectl edit svc <deployment-name>
```

### Commands for creating a pod/service by deploying a YAML file

```
#Create a deployment by applying aks-deploy.yml (this will take a few minutes, especially for the LoadBalancer setup)
#Rk: you could use "create" instead of "apply", but "apply" will perform a "create or update".
kubectl apply \
    -f aks-deploy.yml

#Note: after running this command you should see associated entries with "kubectl get pods", "kubectl get deploy" and "kubectl get svc".
```

### Commands for creating a pod/service by deploying the ACI Connector

```
#Initialize Helm and Tiller
helm init

#Add an ACI Connector node
az aks install-connector \
    -n $AKS \
    -g $RG \
    --connector-name aci-connector

#Optional parameters and default values for "az aks install-connector":
#--os-type Linux

#Deploy the aci-connector.yml
kubectl apply -f ../src/aci-connector.yml

#Check the pod created
kubectl get pods -o wide

#Remove an ACI Connector node
az aks remove-connector \
    -n $AKS \
    -g $RG \
    --connector-name aci-connector
```

## Notes

- AKS is still in preview, not for Production workload yet.
- AKS is managing the master nodes of your Kubernetes cluster, you have commands to interact with and you won't pay for the resources behind the scenes, you just have to pay for your agent nodes resources.
- Kubernetes looks to be THE Container orchestrator the industry and the communities are investing on.
- The ACI Connector ([Virtual Kubelet](https://github.com/virtual-kubelet/virtual-kubelet)) for AKS is really promising, it's bringing the serverless concept for Kubernetes nodes.

## Resources

- [AKS service overview](https://azure.microsoft.com/services/container-service/)
- [AKS service documentation](https://docs.microsoft.com/azure/aks/)
- [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/)
- [ACI CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/aks)
- [AKS - Bug Tracker + Announcements ](https://github.com/Azure/AKS)
- [AKS - FAQ](https://docs.microsoft.com/en-us/azure/aks/faq)
- [Quotas and regional limits](https://docs.microsoft.com/en-us/azure/aks/container-service-quotas)
- [Free eBook: Kubernetes objects on Microsoft Azure](https://blogs.msdn.microsoft.com/azurecat/2018/01/22/new-ebook-kubernetes-objects-on-microsoft-azure/)
- [The Illustrated Children's Guide to Kubernetes](https://www.youtube.com/watch?v=4ht22ReBjno)
- [Why should I care about Kubernetes, Docker, and Container Orchestration?](https://www.hanselman.com/blog/WhyShouldICareAboutKubernetesDockerAndContainerOrchestration.aspx)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- Helm Charts
  - [Kubernetes - Helm Charts](https://github.com/kubernetes/charts)
  - [Azure Samples - Helm Charts](https://github.com/Azure-Samples/helm-charts)
- Other labs:
  - [Azure Samples - Bursting from AKS to ACI with the Virtual Kubelet](https://azure.microsoft.com/en-us/resources/samples/virtual-kubelet-aci-burst/)
  - https://github.com/Azure/blackbelt-aks-hackfest
  - https://github.com/denniszielke/phoenix
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/KubernetesWorkshopsLab
  - https://github.com/Microsoft/MTC_ContainerCamp/tree/master/modules/kubernetes
  - https://github.com/OSSCanada/microhackfest/tree/master/HOL/05_Orchestrator
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/Modules/ContainersOnACSKubernetes
  - https://anthonychu.ca/post/windows-containers-aci-connector-kubernetes/
  - https://anthonychu.ca/post/hybrid-kubernetes-linux-windows-cluster-easy-steps/

## TODO

- Add a section about [Using OpenFaaS on AKS](https://docs.microsoft.com/en-us/azure/aks/openfaas)
- Add a section about [Kubernetes dashboard](https://docs.microsoft.com/en-us/azure/aks/kubernetes-dashboard)
- Add a section about [HTTPS Ingress](https://docs.microsoft.com/en-us/azure/aks/ingress)
- Add a section about [Persistent volumes with Azure files](https://docs.microsoft.com/en-us/azure/aks/azure-files-dynamic-pv)