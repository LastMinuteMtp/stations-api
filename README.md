
```
  mongoexport --db lm --collection stations --out stations.json --journal

  mongoimport -h paulo.mongohq.com --port 10057 -d app18243079 -c stations -u <loginpwd> -p<loginpwd> --type json --file ~/Desktop/stations.jsong
```

- http://sheltered-taiga-6395.herokuapp.com/bikes/43.617266/3.885672/6
- http://sheltered-taiga-6395.herokuapp.com/slots/43.617266/3.885672/8
- http://sheltered-taiga-6395.herokuapp.com/stations/43.617266/3.885672/10
