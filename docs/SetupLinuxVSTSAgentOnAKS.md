# Setup a Linux VSTS Agent on AKS

These snippets and CLI commands are used in this detailed blog article: https://alwaysupalwayson.blogspot.com/2018/05/host-your-private-vsts-linux-agent-in.html

## Prerequisities

- VSTS Account
- AKS Cluster

## Walkthrough

Variables used for these setups:
```
VSTS_TOKEN=<your-vsts-token>
VSTS_ACCOUNT=<your-vsts-account>
```

Note: Create a PAT - https://docs.microsoft.com/en-us/vsts/build-release/actions/agents/v2-linux

### Docker

```
docker run \
  -e VSTS_ACCOUNT=$VSTS_ACCOUNT \
  -e VSTS_TOKEN=$VSTS_TOKEN \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -it microsoft/vsts-agent:latest
```

### Kubernetes

```
kubectl create secret generic vsts \
  --from-literal=VSTS_TOKEN=$VSTS_TOKEN \
  --from-literal=VSTS_ACCOUNT=$VSTS_ACCOUNT

kubectl apply \
  -f aks-vsts-agent-without-pv.yml

kubectl delete pod/<name-of-your-pod>

#Note: There is a limitation to leverage the Kubernetes' Docker host with this setup you have to have in mind. This config is ok for "basic" Docker features (Docker 1.13 and lower) on your agent but if you are using "advanced" Docker features you could get some error messages like "Error parsing reference: "microsoft/aspnetcore-build:1.1 AS build-env" is not a valid repository/tag: invalid reference format". if you are using for example the concept of multi-stage Docker builds. That's a constraint from Kubernetes, [and we don't know when it will be supported in Kubernetes itself](https://github.com/Azure/AKS/issues/63#issuecomment-380931805)...
```

### Kubernetes with Volumes

```
kubectl delete \
  -f aks-vsts-agent-without-pv.yml

kubectl apply \
  -f aks-vsts-agent-sc.yml
kubectl apply \
  -f aks-vsts-agent-pvc.yml
kubectl apply \
  -f aks-vsts-agent-with-pv.yml
```

### Kubernetes with Helm

```
kubectl delete \
  -f aks-vsts-agent-sc.yml
kubectl delete \
  -f aks-vsts-agent-pvc.yml
kubectl delete \
  -f aks-vsts-agent-with-pv.yml

helm init
git clone https://github.com/Azure/helm-vsts-agent.git
VSTS_TOKEN=$(echo -n $VSTS_TOKEN | base64)
helm install \
  --name vsts-agent \
  ./helm-vsts-agent \
  --set vstsToken=$VSTS_TOKEN \
  --set vstsAccount=$VSTS_ACCOUNT \
  --set vstsPool=Default \
  --set replicas=1 \
  --set resources.limits.cpu=0 \
  --set resources.requests.cpu=0

#Note: if you have helm version to 2.9.0, you should get this error: https://github.com/kubernetes/helm/issues/3985, see the associated workaround or upgrade to helm 2.9.1.
```

## Resources

- See the entire walkthrough and the resources of this in my blog article: [Host your Private VSTS Linux Agent in Kubernetes](https://alwaysupalwayson.blogspot.com/2018/05/host-your-private-vsts-linux-agent-in.html)