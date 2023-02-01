# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


class ActionHelloWorld(Action):

     def name(self) -> Text:
         return "action_hello_world"

     def run(self, dispatcher: CollectingDispatcher,
             tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

         dispatcher.utter_message(text="Hello From The Action Server!")

         return []

class ActionCreditHours(Action):

    def name(self) -> Text:
        return "action_credit_hours"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="A Computer Science Degree at UF requires a minimum of 120 total credit hours.")

        return []

class ActionWorkload(Action):
    
    def name(self) -> Text:
        return "action_workload"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Each credit hour is defined as one hour of in-person instruction and a minimum of two hours of out-of-class work per week. A 15-credit semester would consist of 15 hours of in-person instruction, and 30 hours of out-of-class work per week.")

        return []