# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Any, Text, Dict, List

import random

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

from pymongo import MongoClient


class ActionHelloWorld(Action):

     def name(self) -> Text:
         return "action_hello_world"

     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

         client = MongoClient('mongo-db',27017)

         db = client.test_database
         counters = db.counters
         
         count = counters.find_one({"topic": "hello"})
         
         if not count:
            count = {"topic": "hello",
                            "count": 0}
        
         count["count"] = count["count"] + 1
        
         counters.replace_one({"topic":"hello"},count, True)
            

         dispatcher.utter_message(text="Hello From The Action Server! You have said 'hello' to the DB " + str(count["count"]) + " time(s)!")
         return []

class ActionRequestTopics(Action):

    def name(self) -> Text:
        return "action_request_topics"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        client = MongoClient('mongo-db', 27017)

        db = client["chompsci"]
        topics = db.topics

        topic = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic = entity['value']
            
        if topic is None:
            random_topics = random.sample(topics.distinct("topic"), 3)
            dispatcher.utter_message(text=("Sorry, I don't quite understand your question... try rephrasing, or ask about one of these topics."), buttons=[
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[0].lower() + "\"}", "title": random_topics[0]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[1].lower() + "\"}", "title": random_topics[1]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[2].lower() + "\"}", "title": random_topics[2]}
                    ])
        else:
            requested_topic = topics.find_one({"lower_topic": topic.lower()})
                #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

            if not requested_topic:
                random_topics = random.sample(topics.distinct("topic"), 3)
                if not topic:
                    dispatcher.utter_message(text=("I don't know anything about that topic... try asking about one of these topics."), buttons=[
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[0].lower() + "\"}", "title": random_topics[0]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[1].lower() + "\"}", "title": random_topics[1]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[2].lower() + "\"}", "title": random_topics[2]}
                    ])
                else:
                    dispatcher.utter_message(text=("I don't know anything about " + topic.lower() + "... try asking about one of these topics."), buttons=[
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[0].lower() + "\"}", "title": random_topics[0]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[1].lower() + "\"}", "title": random_topics[1]},
                    {"payload": "/request_topics{\"topic\": \"" + random_topics[2].lower() + "\"}", "title": random_topics[2]}
                    ])
            else:
                dispatcher.utter_message(text=("Here is what I know about " + topic.lower() + ": \n" + requested_topic["description"]))
                dispatcher.utter_message(text=("What would you like to know about this topic?"), buttons=[
                    {"payload": "/request_class_by_topic{\"topic\": \"" + topic.lower() + "\"}", "title": "Classes?"},
                    {"payload": "/request_job_by_topic{\"topic\": \"" + topic.lower() + "\"}", "title": "Careers?"},
                    ])
                    

        return []
    
class ActionRequestJobs(Action):

    def name(self) -> Text:
        return "action_request_jobs"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        job_list = db.job_list

        job = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'job':
                job = entity['value']

        requested_job = None

        if job is None:
            random_jobs = random.sample(job_list.distinct("job"), 3)
            dispatcher.utter_message(text=("Sorry, I don't quite understand your question... try rephrasing, or ask about one of these careers."), buttons=[
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[0].lower() + "\"}", "title": random_jobs[0]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[1].lower() + "\"}", "title": random_jobs[1]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[2].lower() + "\"}", "title": random_jobs[2]}
                    ])
        else:
            requested_job = job_list.find_one({"job_lower": job.lower()})
            if not requested_job:
                random_jobs = random.sample(job_list.distinct("job"), 3)
                if not job:
                    dispatcher.utter_message(text=("I don't know anything about that career... try asking about one of these careers."), buttons=[
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[0].lower() + "\"}", "title": random_jobs[0]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[1].lower() + "\"}", "title": random_jobs[1]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[2].lower() + "\"}", "title": random_jobs[2]}
                    ])
                else:
                    dispatcher.utter_message(text=("I don't know anything about " + job.lower() + "... try asking about one of these careers."), buttons=[
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[0].lower() + "\"}", "title": random_jobs[0]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[1].lower() + "\"}", "title": random_jobs[1]},
                    {"payload": "/request_jobs{\"job\": \"" + random_jobs[2].lower() + "\"}", "title": random_jobs[2]}
                    ])
            else:
                dispatcher.utter_message(text=("Here is what I know about careers as a " + job + ": \n" + requested_job["description"]))
                dispatcher.utter_message(text=("You can learn more about it in these classes: " + requested_job["related_courses"]))

        return []

class ActionRequestClassByTopic(Action):

    def name(self) -> Text:
        return "action_request_class_by_topic"
            
    def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]: 
        
        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        topics = db.topics

        topic_request = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic_request = entity['value']

        topic_result = topics.find_one({"lower_topic": topic_request.lower()})

        if not topic_result:
            if not topic_request:
                dispatcher.utter_message(text="Sorry, I don't understand")
            else:
                dispatcher.utter_message(text=("I don't know of any classes related to " + topic_request.lower() + "."))
        else:
            if not topic_result["related_courses"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any careers related to this..."))
            else:
                dispatcher.utter_message(text=("You can learn more about "+topic_request.lower()+" in these classes: \n" + topic_result["related_courses"]))
                

        return []
     
    
class ActionRequestClassByCode(Action):

    def name(self) -> Text:
        return "action_request_class_by_code"
            
    def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]: 
        
        client = MongoClient('mongo-db', 27017)

        db = client.chompsci
        courses = db.courses

        class_request = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'class_code':
                class_request = entity['value'].upper()

        if class_request is None:
            random_courses = random.sample(courses.distinct("code"), 3)
            dispatcher.utter_message(text=("Sorry, I don't quite understand your question... try rephrasing, or ask about one of these courses."), buttons=[
                {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[0] + "\"}", "title": random_courses[0]},
                {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[1] + "\"}", "title": random_courses[1]},
                {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[2] + "\"}", "title": random_courses[2]}
                ])
        else:
            class_result = courses.find_one({"code": class_request})
            if not class_result:
                random_courses = random.sample(courses.distinct("code"), 3)
                if not class_request:
                    dispatcher.utter_message(text=("I don't know of any classes with that code... try asking about one of these courses."), buttons=[
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[0] + "\"}", "title": random_courses[0]},
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[1] + "\"}", "title": random_courses[1]},
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[2] + "\"}", "title": random_courses[2]}
                        ])
                else:
                    dispatcher.utter_message(text=("I don't know of any classes with the code " + class_request + "... try asking about one of these careers."), buttons=[
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[0] + "\"}", "title": random_courses[0]},
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[1] + "\"}", "title": random_courses[1]},
                        {"payload": "/request_class_by_code{\"class_code\": \"" + random_courses[2] + "\"}", "title": random_courses[2]}
                        ])
            else:
                dispatcher.utter_message(text=(class_request + " is " + class_result["name"] + ": \n" + class_result["description"]))
                
        return []
    
class ActionRequestJobByTopic(Action):

    def name(self) -> Text:
        return "action_request_job_by_topic"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        client = MongoClient('mongo-db',27017)

        db = client["chompsci"]
        topics = db.topics

        topic = None

        for entity in tracker.latest_message['entities']:
            if entity["entity"] == 'topic':
                topic = entity['value']
            
        requested_topic = None

        if topic:
            requested_topic = topics.find_one({"lower_topic": topic.lower()})
            #https://stackoverflow.com/questions/6266555/querying-mongodb-via-pymongo-in-case-insensitive-efficiently

        if not requested_topic:
            if not topic:
                dispatcher.utter_message(text="I'm not well-trained on that topic...")
            else:
                response = ""
                response += topic
                dispatcher.utter_message(text=("I'm not well-trained on " + response))
        else:
            if not requested_topic["related_careers"]:
                dispatcher.utter_message(text=("It doesn't seem like there are any careers related to this..."))
            else:
                dispatcher.utter_message(text=("Here is a career related to " + topic.lower() + ": \n" + requested_topic["related_careers"]))

        return []

