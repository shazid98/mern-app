# Kubernetes
**Container deployment era:** Containers are similar to VMs, but they have relaxed isolation properties to share the Operating System (OS) among the applications. Therefore, containers are considered lightweight. Similar to a VM, a container has its own filesystem, share of CPU, memory, process space, and more. As they are decoupled from the underlying infrastructure, they are portable across clouds and OS distributions.

Containers have become popular because they provide extra benefits, such as:

- Agile application creation and deployment: increased ease and efficiency of container image creation compared to VM image use.
- Continuous development, integration, and deployment: provides for reliable and frequent container image build and deployment with quick and efficient rollbacks (due to image immutability).
- Dev and Ops separation of concerns: create application container images at build/release time rather than deployment time, thereby decoupling applications from infrastructure.
- Observability: not only surfaces OS-level information and metrics, but also application health and other signals.
- Environmental consistency across development, testing, and production: Runs the same on a laptop as it does in the cloud.
- Cloud and OS distribution portability: Runs on Ubuntu, RHEL, CoreOS, on-premises, on major public clouds, and anywhere else.
- Application-centric management: Raises the level of abstraction from running an OS on virtual hardware to running an application on an OS using logical resources.
- Loosely coupled, distributed, elastic, liberated micro-services: applications are broken into smaller, independent pieces and can be deployed and managed dynamically – not a monolithic stack running on one big single-purpose machine.
- Resource isolation: predictable application performance.
- Resource utilization: high efficiency and density

## **Why you need Kubernetes and what it can do**

Containers are a good way to bundle and run your applications. In a production environment, you need to manage the containers that run the applications and ensure that there is no downtime. For example, if a container goes down, another container needs to start. Wouldn't it be easier if this behavior was handled by a system?

That's how Kubernetes comes to the rescue! Kubernetes provides you with a framework to run distributed systems resiliently. It takes care of scaling and failover for your application, provides deployment patterns, and more. For example, Kubernetes can easily manage a canary deployment for your system.

Kubernetes provides you with:

- **Service discovery and load balancing** Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.
- **Storage orchestration** Kubernetes allows you to automatically mount a storage system of your choice, such as local storages, public cloud providers, and more.
- **Automated rollouts and rollbacks** You can describe the desired state for your deployed containers using Kubernetes, and it can change the actual state to the desired state at a controlled rate. For example, you can automate Kubernetes to create new containers for your deployment, remove existing containers and adopt all their resources to the new container.
- **Automatic bin packing** You provide Kubernetes with a cluster of nodes that it can use to run containerized tasks. You tell Kubernetes how much CPU and memory (RAM) each container needs. Kubernetes can fit containers onto your nodes to make the best use of your resources.
- **Self-healing** Kubernetes restarts containers that fail, replaces containers, kills containers that don't respond to your user-defined health check, and doesn't advertise them to clients until they are ready to serve.
- **Secret and configuration management** Kubernetes lets you store and manage sensitive information, such as passwords, OAuth tokens, and SSH keys. You can deploy and update secrets and application configuration without rebuilding your container images, and without exposing secrets in your stack configuration

## **What Kubernetes is not**

Kubernetes is not a traditional, all-inclusive PaaS (Platform as a Service) system. Since Kubernetes operates at the container level rather than at the hardware level, it provides some generally applicable features common to PaaS offerings, such as deployment, scaling, load balancing, and lets users integrate their logging, monitoring, and alerting solutions. However, Kubernetes is not monolithic, and these default solutions are optional and pluggable. Kubernetes provides the building blocks for building developer platforms, but preserves user choice and flexibility where it is important.

#### Kubernetes:

- Does not limit the types of applications supported. Kubernetes aims to support an extremely diverse variety of workloads, including stateless, stateful, and data-processing workloads. If an application can run in a container, it should run great on Kubernetes.
- Does not deploy source code and does not build your application. Continuous Integration, Delivery, and Deployment (CI/CD) workflows are determined by organization cultures and preferences as well as technical requirements.
- Does not provide application-level services, such as middleware (for example, message buses), data-processing frameworks (for example, Spark), databases (for example, MySQL), caches, nor cluster storage systems (for example, Ceph) as built-in services. Such components can run on Kubernetes, and/or can be accessed by applications running on Kubernetes through portable mechanisms, such as the [Open Service Broker](https://openservicebrokerapi.org/).
- Does not dictate logging, monitoring, or alerting solutions. It provides some integrations as proof of concept, and mechanisms to collect and export metrics.
- Does not provide nor mandate a configuration language/system (for example, Jsonnet). It provides a declarative API that may be targeted by arbitrary forms of declarative specifications.
- Does not provide nor adopt any comprehensive machine configuration, maintenance, management, or self-healing systems.
- Additionally, Kubernetes is not a mere orchestration system. In fact, it eliminates the need for orchestration. The technical definition of orchestration is execution of a defined workflow: first do A, then B, then C. In contrast, Kubernetes comprises a set of independent, composable control processes that continuously drive the current state towards the provided desired state. It shouldn't matter how you get from A to C. Centralized control is also not required. This results in a system that is easier to use and more powerful, robust, resilient, and extensible.


### How to install Kubernetes
- Go on Docker Desktop: [https://hub.docker.com/r/kubernetes/kubelet/](https://hub.docker.com/r/kubernetes/kubelet/)
- Go to settings
- Select "Enable Kubernetes"

### Kubernetes Commands
`kubectl` - basic command to call kubernetes

`kubectl get service` - gets a service

`kubectl get svc` - same as above

`kubectl get deployment` - gets a deployment

`kubectl get deploy` - same as above

`kubectl get pods` - gets a pod

`kubectl delete svc nameofservice` - deletes a service

`kubectl get all` - gets all resources

`kubectl cluster-info` - gets cluster info

`kubectl describe deploy` - describes a deployment

![](/images/k8-app-deployment.png)


## **How to create app-db k8 deployment**

Creating a k8 deployment is a two-step process. First, you create a deployment. Second, you create a service that points to the deployment.
In this case we need to run the db first and then the app afterwards, to grab the cluster-ip of the db as the environment variable for the app.



### **mongo-deploy.yml**
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  selector:
    matchLabels:
      app: mongodb
  replicas: 3
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: shazid98/eng114-shazid-app:db1

          ports:
            - containerPort: 27017


          imagePullPolicy: Always
```

### **mongo-svc.yml**
```
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: default
spec: 
  ports:
    - port: 27017
      protocol: TCP
      targetPort: 27017
      
      

  selector:
    app: mongodb
  #type: NodePort
```
#### Run the following for the db image to be available:

``` 
kubectl create -f mongo-deploy.yml
```

```
kubectl create -f mongo-svc.yml
```




### **node-deploy.yml**
``` 
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node
spec:
  selector:
    matchLabels:
      app: node
  replicas: 3
  template:
    metadata:
      labels:
        app: node
    spec:
      containers:
        - name: node
          image: shazid98/eng114-shazid-app:v4
          env:
          - name: DB_HOST
            value: mongodb://10.101.198.53:27017/posts #replace with mongodb ip

          ports:
            - containerPort: 3000

          imagePullPolicy: Always

```

### **node-svc.yml**
```
apiVersion: v1
kind: Service
metadata:
  name: node
  namespace: default
spec: 
  ports:
    - nodePort: 30000 # - 30000-302222
      port: 3000
      protocol: TCP
      targetPort: 3000

  selector:
    app: node
  type: NodePort
```

Run the following for the node image to be available:


```
kubectl create -f node-deploy.yml
```

```
kubectl create -f node-svc.yml
```

`kubectl exec pod-name env node seeds/seed.js` to show /posts with the node image