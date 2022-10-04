You can't run multiple instances of mongo can't be scalled in cluster that's why these services are managed outside kubernetes cluster.

# first run mongo deployment using following command. 

kubectl apply -f .\mongo-deploy.yml

#then run it's service 

kubectl.exe apply -f .\mongo-svc.yml

# After that run backend deployment with same as above command but make sure pointing to the right file. And rhen run service of that
# after this run client's deployment and then service and at last run nginx deployment and then it's service.

make sure you are providing right image names in every deployment. 

kubectl port-forward service/nginx 80:80