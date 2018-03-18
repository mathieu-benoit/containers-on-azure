# Deploy a Docker container on Azure Managed Kubernetes (AKS)

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

#Create the ACS cluster with Kubernetes as the orchestrator (~ 10 mins)
#Note: it will create another resource group "MC_$RG_$AKS_$LOC in which you will find all the agend nodes resources
az aks create \
    -g $RG \
    -n $AKS \
    -l $LOC \
    --generate-ssh-keys

#Optional parameters and default values for "az aks create":
#--no-wait false
#--node-count 3
#--kubernetes-version 1.7.9
#--admin-username azureuser
#--ssh-key-value ~.sshid_rsa.pub
#--service-principal --> see details [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal).

#Get the information of your AKS
az aks show \
    -n $AKS \
    -g $RG \
    --output table

#Get the cluster credentials
az aks get-credentials \
    -g $RG \
    -n $AKS

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

#Get the Kubernetes versions available for Kubernetes in AKS (~ 10 mins)
az aks get-upgrades \
    -n $AKS \
    -g $RG \
    --output table

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

## Commands for managing your pods and services

### General commands for managing your pods and services

```
#List the pods
#Rk: add a " | grep XXX" at the end of this command to only list the pods containing XXX in the name
#Other rk: "kubectl get pod" works as well for the same purpose
kubectl get pods

#List the services
#Rk: add a " | grep XXX" at the end of this command to only list the services containing XXX in the name
#Other rk: "kubectl get svc" works as well for the same purpose
kubectl get service

kubectl get service $IMG \
    --watch

#Open a bash session to execute commands in a specific pod
kubectl exec \
    -it $POD bash

#Delete a pod, service, deployment by their yaml file
kubectl delete \
    -f $IMG.yaml
```

### Commands for creating a pod/service by deploying a YAML file

```
#Apply a pod using the data in myapp.yml
#Rk: you could use "create" instead of "apply", but "apply" will perform a "create or update".
#FIXME: more details to provide here according this: https://github.com/denniszielke/phoenix/blob/master/hints/yamlfiles.md
kubectl apply \
    -f $IMG.yml
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
kubectl apply -f aci-connector.yml

TODO
https://github.com/virtual-kubelet/virtual-kubelet/blob/master/providers/azure/README.md#schedule-a-pod-in-aci

#Remove an ACI Connector node
az aks remove-connector \
    -n $AKS \
    --connector-name aci-connector
```

## Notes

- AKS is still in preview, not for Production workload yet.
- AKS is managing the master nodes of your Kubernetes cluster, you have commands to interact with and you won't pay for the resources behind the scenes, just for your agent nodes resources.
- Kubernetes looks to be THE Container orchestrator the industry and the communities are investing on.
- The ACI Connector ([Virtual Kubelet](https://github.com/virtual-kubelet/virtual-kubelet))for AKS is really promising, it is bringing the serverless concept for Kubernetes.

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
- Other labs:
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