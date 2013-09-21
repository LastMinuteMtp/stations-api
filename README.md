
```
  mongoexport --db lm --collection stations --out stations.json --journal

  mongoimport -h paulo.mongohq.com --port 10057 -d app18243079 -c stations -u lastminute -plastminute --type json --file ~/Desktop/stations.json
```
