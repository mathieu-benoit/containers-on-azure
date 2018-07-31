# Play with Azure Kubernetes Service (AKS)

- [Managing your Kubernetes cluster](#commands-for-managing-your-kubernetes-cluster)
- [Container Registry access setup](#container-registry-access-setup)
- [Interacting and managing your pods and services](#interacting-and-managing-your-pods-and-services)
- [Managing deployments by "kubectl run/set" commands](#managing-deployments-by-kubectl-runset-commands)
- [Managing deployments by YAML file](#managing-deployments-by-yaml-file)
- [Managing deployments by ACI Connector](#managing-deployments-by-aci-connector)
- [Notes](#notes)
- [Resources](#resources)

```
#The following variables will be used within the scope of the commands illustrated below:
RG=<your-resource-group-name>
AKS=<your-aks-name>
LOC=<your-aks-location>
IMG=<your-docker-image-name>
```

## Managing your Kubernetes cluster

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
#--kubernetes-version 1.10.5
#--admin-username azureuser
#--ssh-key-value ~.sshid_rsa.pub
#--service-principal --> see details [here](https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal)
#--enable-addons http_application_routing --> see details [here](https://docs.microsoft.com/en-us/azure/aks/http-application-routing)

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
az group deployment list \
  -g MC_$RG_$AKS_$LOC \
  -o table
#To see the Azure resources actually deployed for your AKS agent nodes
az group deployment operation list \
  -g MC_$RG_$AKS_$LOC \
  -n <deployment-name> \
  --query '[].{resource:properties.targetResource.resourceType}' \
  -o table

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

#To see the deployment entries history of your AKS agent nodes resource group auto-created when you provisioned 
az group deployment list \
  -g MC_$RG_$AKS_$LOC \
  -o table
#To see the Azure resources actually deployed for your AKS agent nodes
az group deployment operation list \
  -g MC_$RG_$AKS_$LOC \
  -n <deployment-name> \
  --query '[].{resource:properties.targetResource.resourceType}' \
  -o table

#Get the Kubernetes versions available for upgrading your Kubernetes cluster
az aks get-upgrades \
    -n $AKS \
    -g $RG \
    -o table

#Upgrade the version of your Kubernetes cluster
az aks upgrade \
    -n $AKS \
    -g $RG \
    --kubernetes-version 1.10.5
```

## Container Registry access setup

Based on the official documentation about [how to setup the access to your Container Registry from your AKS cluster](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks), we will illustrate below 3 ways to accomplish that, according your needs and context.

```
#The following variables will be used within the scope of the commands illustrated below:
ACR_RG=<acr-resource-group-name>
ACR=<acr-name>
```

### Without K8S `Secret`

You could just run the commands below to grant the cluster's service principal access to the container registry.

```
CLIENT_ID=$(az aks show -g $RG -n $AKS --query "servicePrincipalProfile.clientId" --output tsv)
ACR_ID=$(az acr show --name $ACR --resource-group $ACR_RG --query "id" --output tsv)
az role assignment create --assignee $CLIENT_ID --role Reader --scope $ACR_ID
```

### With K8S `Secret` with `Service Principal`

*Note: this approach has the advantage to leverage both the K8S `Secret` to be more generic and the `Service Principal` with role access to more secure and flexible.*

```
SERVICE_PRINCIPAL_NAME=acr-service-principal
ACR_SERVER=$(az acr show -n $ACR --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show -n $ACR --query id --output tsv)
SP_PWD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --role Reader --scopes $ACR_REGISTRY_ID --query password --output tsv)
CLIENT_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)
kubectl create secret docker-registry acr-secret \
    --docker-server=$ACR_SERVER \
    --docker-username=$CLIENT_ID \
    --docker-password=$SP_PWD \
    --docker-email=superman@heroes.com
```

### With K8S `Secret` with `Service Principal`

This approach could be accomplish if for example you don't have the proper rights within the Azure subscription to interact with the `Service Princial` illustrated above and you would like instead use the ACR's admin login.

```
ACR_SERVER=$(az acr show -n $ACR --query loginServer)
ACR_USER=$(az acr credential show -n $ACR --query "username")
ACR_PWD=$(az acr credential show -n $ACR --query "passwords[0].value")
kubectl create secret docker-registry acr-secret \
    --docker-server=$ACR_SERVER \
    --docker-username=$ACR_USER \
    --docker-password=$ACR_PWD \
    --docker-email=superman@heroes.com
```

## Interacting and managing your pods and services

```
#List the pods
#Rk: add a " | grep XXX" at the end of this command to only list the pods containing XXX in the name
#Other rk: "kubectl get pod" and "kubectl get po" work as well for the same purpose
kubectl get pods
#Note: you could add '-o wide' to have more info like for example the node on wich each pod is running.

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

#List the deployments
#Other rk: "kubectl get deployment" works as well for the same purpose
kubectl get deploy

#Get the information for a specific deployment
DEPLOY_NAME=<deployment-name>
kubectl describe deploy $DEPLOY_NAME

#Scale pods
kubectl scale --replicas=3 deployment/$DEPLOY_NAME

#Set Autoscale
#Note: you need to setup resources:requests/cpu before
kubectl autoscale deployment $DEPLOY_NAME --cpu-percent=50 --min=3 --max=10
#You could see the status of the autoscaler:
kubectl get hpa

#Delete a pod, service, deployment by their yaml file
kubectl delete \
    -f aks-deploy.yml

#Delete a pod
kubectl delete pod <pod-name>

#Delete a svc
kubectl delete svc <svc-name>

#Delete a deployment
kubectl delete deploy $DEPLOY_NAME
```

## Managing deployments by "kubectl run/set" commands

```
#Run a Docker image in the Kubernetes cluster
kubectl run $DEPLOY_NAME \
  --image $IMG \
  --port 80 \
  --env CONTAINER_HOST=AKS

#Note: after running this command you should see associated entries with "kubectl get pods" and "kubectl get deploy"

#Expose the instance to the world via Azure Load Balancer (this will take a few minutes)
kubectl expose deployment $DEPLOY_NAME \
  --port 80 \
  --type LoadBalancer

#Watch the service to get the external IP as it's provisioned
kubectl get svc $DEPLOY_NAME -w

#Edit the deployment deployed
kubectl edit deploy $DEPLOY_NAME

#Edit the service deployed
kubectl edit svc $DEPLOY_NAME

#Set resources cpu/memory limits/requests for all containers of a specific deployment
kubectl set resources deployment $DEPLOY_NAME \
  --limits cpu=200m,memory=512Mi \
  --requests cpu=100m,memory=256Mi
#Note: you could add -c <container-name> for setting these resources just on a specific container

#Set environment variables
kubectl set env deployment/$DEPLOY_NAME MY_ENV=MY_VALUE

#List environment variables 
kubectl set env deployment/$DEPLOY_NAME --list

#Update a Container image
#Important note: current pod(s) associated to deployment/$DEPLOY_NAME will be removed and new associated pod(s) will be created.
kubectl set image deployment/$DEPLOY_NAME <container-image>=<container-image>:<new-tag>
```

## Managing deployments by YAML file

```
#Create/Update a deployment by applying aks-deploy.yml (this will take a few minutes, especially for the LoadBalancer creation)
#Rk: you could use "create" instead of "apply", but "apply" will perform a "create or update".
#Important note: current pod(s) associated to this deployment will be removed and new associated pod(s) will be created.
kubectl apply \
    -f aks-deploy.yml

#Note: after running this command you should see associated entries with "kubectl get pods", "kubectl get deploy" and "kubectl get svc".
```

## Managing deployments by ACI Connector

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

#Note: after running this command you should see associated entries with "kubectl get pods" and "kubectl get nodes".

#Deploy the aci-connector.yml
kubectl apply -f ../src/aci-connector.yml

#Note: after running this command you should see associated entries with "kubectl get pods".

#Remove an ACI Connector node
az aks remove-connector \
    -n $AKS \
    -g $RG \
    --connector-name aci-connector
```

## Notes

- AKS is managing the master nodes of your Kubernetes cluster, you have commands to interact with and you won't pay for the resources behind the scenes, you just have to pay for your agent nodes resources.
- Kubernetes looks to be THE Container orchestrator the industry and the communities are investing on.
- The ACI Connector ([Virtual Kubelet](https://github.com/virtual-kubelet/virtual-kubelet)) for AKS is really promising, it's bringing the serverless concept for Containers.

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
- [LinuxFoundationX: LFS158x - Introduction to Kubernetes](https://courses.edx.org/courses/course-v1:LinuxFoundationX+LFS158x+1T2018/course/)
- [Why should I care about Kubernetes, Docker, and Container Orchestration?](https://www.hanselman.com/blog/WhyShouldICareAboutKubernetesDockerAndContainerOrchestration.aspx)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetes Client Libraries](https://kubernetes.io/docs/reference/client-libraries/)
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
