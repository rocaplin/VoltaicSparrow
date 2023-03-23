# Notes and Analysis on Rasa Test Results during Alpha Round

Prepared by Robert Caplin 03/22/2023.

Fetch and pull the latest version of main/ test branch from the repo. Run Docker Desktop locally.

## Run Rasa Tests from Project Root

1. Validate training data.

   ```
   rasa-dev validate
   ```

   03/22/2023 - PASS - All training data is well formed.

2. Train and Test the Model

   ```
   rasa-dev train test
   ```

   03/22/2023 - PASS - Model successfully trained.
   03/22/2023 - FAIL - Model does not pass all test cases.

### Analysis of Rasa Test Results

__NOTE__: There are generally two types of tests run by Rasa, those that rely exclusively on training data and those that rely on test stories.

During testing, a portion of the __training data__ is withheld and the bot is trained on the remainder. Its ability to correctly handle the withheld training data is then used in assessment. Rasa is capable of "n-pleated testing", which refers to how the training data will be segmented. By default there are 5 segments, so the model is trained on 80% of the training data and tested on the other 20%. This process is repeated 5 times so that all of the training data gets a chance to be used in assessment.

__Test stories__ are written when adding new training data to the model. They represent the conversations that the bot is intended to have with users as described by a series of test inputs and expected outputs. If the model is unable to identify the test input or responds differently from what is described in the test story the story fails.

It is worth noting that results of these tests do not necessarily correspond precisely to what is observed when using the bot. That said, these tests provide some insight into why the model functions the way it does. The results can help to uncover minor or hidden issues as well as to help troubleshoot unexpected behavior.

#### Entity Extraction

Entity extraction refers to labeling of data from input by category. For example, recognizing "artificial intelligence" or "quantum computing" as "topics" in the training data.

Tests pertaining to entity extraction performance in the context of test stories. 

   - DIETClassifier_confusion_matrix.png
      Of 1,243 labels tested, 1 non-entity was incorrectly identified as a "job".
   - DIETClassifier_errors.json
      From the training string "What jobs are there as a computer programmer", the entity extractor incorrectly predicts two instead of one jobs:
      - "computer programmer" at 99%+ conficence (correct)
      - "a" at 62%+ confidence (incorrect)
   - DIETClassifier_histogram.png
      The majority of labels extracted are correctly identified at greater than 95% confidence. There is one incorrect prediction at 62% confidence and one correct prediction at 57% confidence.
   - DIETClassifier_report.json
      Summary of the entity extractor's accuracy. The model scores 100% accuracy in predicting 72 "topic" labels from the training data. The model scores 98%+ accuracy in predicting 32 "job" labels from the training data. The overall label prediction accuracy of the model is 99%+.

Tests pertaining to the performance of entity extraction within the context of training data.
   - RegexEntityExtractor_confusion_matrix.png
      - Of 1,243 pieces of training data...
         - 6 non-etities are incorectly identified as "job"
         - 1 "topic" is incorrectly identified as a non-entity
         - 2 non-entities are incorrectly identified as "topic"
   - RegexEntityExtractor_errors.json
      - There is a typo in the training data at line 104 in nlu.yml for "request_jobs" intent:
  ```[Security Analyst{"entity": "job"} careers```
  $\rightarrow$
  ```[Security Analyst]{"entity": "job"} careers```
   - RegexEntityExtractor_report.json
      The accuracy of entity extraction against training data.
      - topic: 97%+ with 72 labels
      - job: 91%+ with 32 labels
      - overall: 99%+ with 104 labels

"TED" Policy performance. This feature is involved in action prediction and entity recognition. See [Rasa Documentation](https://rasa.com/docs/rasa/policies/#ted-policy) for details.

   - TEDPolicy_confusion_matrix.png
      - 11 job entities are incorrectly identified as non-entitites
      - 45 non-entities are correctly identified as non-entitites
      - 18 topic entities are incorrectly identified as non-entities
   - TEDPolicy_errors.json
      Given the following test inputs in test stories, an entity could not be extracted:
      - "What careers are there as a video game developer"
      - "Video Game Developer"
      - "it architect"
      - "Can you tell me about concurrency"
      - "Can you tell me about artificial intelligence"
      - "Can you tell me about natural language processing"
      - "What is networking"
      - "What is Soft computing"
      - "What is computational complexity theory"
      - "What are algorithms"
      - "What are Data Structures"
      - "What are programming lanugage pragmatics"
      - "What careers are there as a database administrator"
      - "What careers are there as a Mathmatician"
   - TEDPolicy_report.json
      Of 29 test inputs involving entity extraction, no entities were extracted. The overall accuracy of entity extraction is accessed at 60%+.

#### Test Stories

Test stories are sample conversations written as component tests. They assess the ability of the model to identify intents, extract entities, and predict responses within the context of a predefined sample conversation... the test story. Test stories should be representative of the types of conversations the bot is expected to have with users.

   - failed_test_stories.yml
      - ask about online classes 1
         After responding to a query about online classes... instead of the model predicting "action_listen" to listen for a new query, it predicts "utter_ask_again" which is intended to ask the user if they would like to know more about another related field in Computer Science.      
      - ask about online classes 2
         See above.
      - ask about adjacent fields 5
         - The model incorrectly predicts the "nlu_fallback" intent when given the input "how is computer science compared to different fields?" rather than the "adjacent_fields" intent.
         - Test input incorrectly triggers "action_unlikely_intent" response when it is intended to trigger "utter_electrical_engineering".
         - The test input "not at all" is incorrectly identified as intent "mood_unhappy" when the test expects "deny".
      - ask about adjacent fields 6
         - Given the input "how is computer is computer science different" the model identifies the intent as "difference" when "adjacent_fields" is expected by the test case.
      - ask about adjacent fields 7
         - Given the input "what makes computer science different?" the model identifies the intent as "difference" when "adjacent_fields" is expected by the test case.
         - Test input incorrectly triggers "action_unlikely_intent" when the test case expects "utter_software_engineering".
      - ask about adjacent fields 8
         - Given test input "compare computer science" the model predicts "nlu_fallback" as the intent rather than "adjacent_fields" as expected in the test case.
      - computer science history 2
         - Given test input "How did Computer Science develop?" the entity extractor identifies "develop" as a job.
         - The model responsds with "action_default_fallback" when "utter_faq/cshistory" is expected by the test case.
   - stories_with_warnings.yml
      - ask about adjacent fields 3
         - The model predicts "action_unlikely_intent" rather than "utter_electrical_engineering" in response to test input.
      - ask about adjacent fields 1
         - The model predicts "action_unlikely_intent" rather than "utter_computer_engineering" in response to test input.
      - ask about adjacent fields 9
         - The model predicts "action_unlikely_intent" rather than "utter_information_technology" in response to test input.
  - story_confusion_matrix.png
      - The model is incorrectly predicting the action "utter_ask_again" in two instances when the test story expects "action_listen".
   - story_report.json
      precision/ recall of various intents and actions.

#### Intent Classification

Intents are just that... the intent behind user input. Much of the training data consists of input examples that are associated with a given intent. Rasa assesses the accuracy of intent recognition within the context of available training data.

   - intent_confusion_matrix.png
      The model is able to predict intent correctly 100% of the time against supplied training data.
   - intent_histogram.png
      The confidence the model has when predicting the intent of supplied traning data. Confidence for the majority of predictions is above 95%. The lowest confidence prediction is at 86%.
   - intent_report.json
      Acurracy of prediction against supplied training data and the number of examples corresponding to each intent within the training data.

#### FAQ Classification

FAQs utilize Rasa's "rule" functionality. Rules are intended to be used for single turn input/ response pairs where deciding on a response requires no context.

Response prediction for FAQs.
   - response_selection_confusion_matrix.png
      - Intent is correctly identified for 68 examples of FAQ training data.
   - reponse_selection_histogram.png
      - Confidence in response prediction approaches 100%. Note that the only value appearing on the vertical scale is "1.00". The histogram shows relative differences in confidence between prediction, but all predictions are close enough to "1.00" that no other value appears on the vertical scale.
   - response_selection_report.json
      - Prediciton accuracy and number of training examples for each FAQ intent.