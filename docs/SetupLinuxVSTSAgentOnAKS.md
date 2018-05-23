# Setup a Linux VSTS Agent on AKS

## Prerequisities

- VSTS Account
- AKS Cluster

## Walkthrough

Variables used for these setups:
```
VSTS_TOKEN=<your-vsts-token>
VSTS_ACCOUNT=<your-vsts-account>
```

### Setup manually

Create a PAT - https://docs.microsoft.com/en-us/vsts/build-release/actions/agents/v2-linux

```
docker run \
  -e VSTS_ACCOUNT=$VSTS_ACCOUNT \
  -e VSTS_TOKEN=$VSTS_TOKEN \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -it microsoft/vsts-agent:latest
```

```
kubectl create secret generic vsts-pat \
  --from-literal=VSTS_TOKEN=$VSTS_TOKEN \
  --from-literal=VSTS_ACCOUNT=$VSTS_ACCOUNT

kubectl apply -f ../src/vsts-agent/aka-vsts-agent-sc.yml
kubectl apply -f ../src/vsts-agent/aka-vsts-agent-pvc.yml
kubectl apply -f ../src/vsts-agent/aka-vsts-agent.yml
```

### Setup by Helm Chart

VSTS_TOKEN=$(echo -n $VSTS_TOKEN | base64)

helm init
#Note: if you have helm version to 2.9.0, you should get this error: https://github.com/kubernetes/helm/issues/3985, see the associated workaround or upgrade to helm 2.9.1.
git clone https://github.com/Azure/helm-vsts-agent.git
helm install \
  --name vsts-agent \
  ./helm-vsts-agent \
  --set vstsToken=$VSTS_TOKEN \
  --set vstsAccount=$VSTS_ACCOUNT \
  --set vstsPool=Default \
  --set replicas=1 \
  --set resources.limits.cpu=0 \
  --set resources.requests.cpu=0

## Resources

- See the entire walkthrough and the resources of this in my blog article: [Host your Private VSTS Linux Agent in Kubernetes]()