#!/bin/bash

mongoimport --db chompsci --collection courses --type=json --file /seeddata/courses.json
mongoimport --db chompsci --collection job_list --type=json --file /seeddata/job_list.json
mongoimport --db chompsci --collection topics --type=json --file /seeddata/topics.json