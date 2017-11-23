# Deploy a Docker container on Azure Managed Kubernetes (AKS)

## Commands

```
az aks create \
    -g MyResourceGroup \
    -n MyManagedCluster

#Create the ACS cluster with Kubernetes as the orchestrator (~ 10 mins)
az aks create \
    -g myResourceGroup \
    -n myK8sCluster --generate-ssh-keys

#Install kubectl
az aks install-cli

#Get the cluster credentials
az aks get-credentials \
    -g myResourceGroup \
    -n myK8sCluster

kubectl get nodes

#Create and run a single instance of nodejs-helloworld.
#https://github.com/denniszielke/phoenix/blob/master/hints/k8sSingle.md
kubectl run nodejs-helloworld \
    --image=<dockerhub-username>/nodejs-helloworld

#Create a pod using the data in myapp.yml.
#https://github.com/denniszielke/phoenix/blob/master/hints/yamlfiles.md
kubectl create \
    -f nodejs-helloworld.yml

kubectl get service nodejs-helloworld \
    --watch
```

## Notes

TODO

## Resources

- [AKS service overview](https://azure.microsoft.com/services/container-service/)
- [AKS service documentation](https://docs.microsoft.com/azure/aks/)
- [AKS pricing](https://azure.microsoft.com/pricing/details/container-service/)
- [ACI CLI 2.0 documentation](https://docs.microsoft.com/cli/azure/aks)
- [AKS - Bug Tracker + Announcements ](https://github.com/Azure/AKS)
- Other labs:
  - https://github.com/denniszielke/phoenix
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/KubernetesWorkshopsLab
  - https://github.com/Microsoft/MTC_ContainerCamp/tree/master/modules/kubernetes
  - https://github.com/OSSCanada/microhackfest/tree/master/HOL/05_Orchestrator
  - https://github.com/Microsoft/OpenSourceLabs/tree/master/ApplicationModernization/Modules/ContainersOnACSKubernetes
  - https://anthonychu.ca/post/windows-containers-aci-connector-kubernetes/