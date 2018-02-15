# Deploy a Docker container on Azure Managed Kubernetes (AKS)

## Commands

```
#Create the ACS cluster with Kubernetes as the orchestrator (~ 10 mins)
az aks create \
    -g myResourceGroup \
    -n myK8sCluster \
    --generate-ssh-keys

#Get the information of your AKS
az aks show \
    -n myK8sCluster \
    -g myResourceGroup \
    --output table

#Install kubectl
az aks install-cli

#Get the cluster credentials
az aks get-credentials \
    -g myResourceGroup \
    -n myK8sCluster

kubectl get nodes

watch kubectl get nodes

#Get more details about your cluster
kubectl cluster-info

#Setup AKS with access to Azure Container Registry
kubectl create secret docker-registry acr-secret \
    --docker-server=$ACR_SERVER \
    --docker-username=$ACR_USER \
    --docker-password=$ACR_PWD \
    --docker-email=superman@heroes.com

#Create and run a single instance of nodejs-helloworld.
#https://github.com/denniszielke/phoenix/blob/master/hints/k8sSingle.md
kubectl run nodejs-helloworld \
    --image <dockerhub-username>/nodejs-helloworld

#Apply a pod using the data in myapp.yml.
#Rk: you could use "create" insteand of "apply", but "apply" will perform a "create or update".
#https://github.com/denniszielke/phoenix/blob/master/hints/yamlfiles.md
kubectl apply \
    -f nodejs-helloworld.yml

#Delete a pod, service, deployment by their yaml file
kubectl delete \
    -f heroes-db.yaml

#List the pods
#Rk: add a " | XXX" at the end of this command to only list the pods containing XXX in the name
kubectl get pods

#List the services
#Rk: add a " | XXX" at the end of this command to only list the services containing XXX in the name
#Other rk: "kubectl get svc" works as well for the same purpose
kubectl get service

kubectl get service nodejs-helloworld \
    --watch

az aks scale \
    -g $RESOURCE_GROUP_NAME \
    -n $AKS_CLUSTER_NAME \
    --node-count 4

#Open a bash session to execute commands in a specific pod
kubectl exec \
    -it $POD bash

#Get the Kubernetes versions available with AKS
az aks get-versions

az aks get-upgrades \
    -n $AKS_CLUSTER_NAME \
    -g $RESOURCE_GROUP_NAME \
    --output table

az aks upgrade \
    -n $AKS_CLUSTER_NAME \
    -g $RESOURCE_GROUP_NAME \
    --kubernetes-version 1.8.2
```

## Notes

TODO

## Resources

- [AKS service overview](https://azure.microsoft.com/services/container-service/)
- [AKS service documentation](https://docs.microsoft.com/azure/aks/)
- [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/)
- [ACI CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/aks)
- [AKS - Bug Tracker + Announcements ](https://github.com/Azure/AKS)
- [Free eBook: Kubernetes objects on Microsoft Azure](https://blogs.msdn.microsoft.com/azurecat/2018/01/22/new-ebook-kubernetes-objects-on-microsoft-azure/)
- [The Illustrated Children's Guide to Kubernetes](https://www.youtube.com/watch?v=4ht22ReBjno)
- Other labs:
  - https://github.com/Azure/blackbelt-aks-hackfest
  - https://github.com/denniszielke/phoenix
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/KubernetesWorkshopsLab
  - https://github.com/Microsoft/MTC_ContainerCamp/tree/master/modules/kubernetes
  - https://github.com/OSSCanada/microhackfest/tree/master/HOL/05_Orchestrator
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/Modules/ContainersOnACSKubernetes
  - https://anthonychu.ca/post/windows-containers-aci-connector-kubernetes/
  - https://anthonychu.ca/post/hybrid-kubernetes-linux-windows-cluster-easy-steps/