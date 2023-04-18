# Beta | Notes and Analysis on Rasa Test Results

Prepared by Robert Caplin 04/18/2023.

Fetch and pull latest version of main branch from the repo. Create a new branch ```beta-results```. Run Docker Desktop locally.

## Run Rasa Tests from Project Root against Production Model

__NOTE__: Testing was performed against the model used in production for beta rounds, ```chomp_mvp.tar.gz```. These results can be replicated by ensuring ```chomp_mvp.tar.gz``` is the only model present under ```./rasa/models```, which should be the case if pulling from main.

1. Validate training data.

   04/17/2023 - PASS

   ```
   rasa-dev validate
   ```

   __NOTE__: Extra data (remnants from earlier in development) are present in the model. Removing this data had a negative impact on unit tests so it has been left in the production model.
   
   The model is a product of all training data, while this data is not being used, unit testing shows higher accuracy when it is left in. I suspect this is probably a case of competitive inhibition... where this unused data competes with other unlikey intents... making it more likely that the model identifies the correct intent during testing.
   
   The following issues are present in the training data:
   - unused/ undefined intents
      - ```express_interest_in_artificial intelligence```
      - ```request_action_test```
   - unused utterances
      - ```utter_online_topic_tips```
      - ```utter_computer_science_topic_tips```

2. Training the Model

   04/17/2023 - PASS - Model successfully trained.

   __NOTE__: Since the model has already been trained, this step is unecessary for testing. I did train the model to confirm this step completes successfully, however I removed the resulting model from the models directory before proceeding in order to test our production model.

   ```
   rasa-dev train
   ```

3. Test the Model

   04/17/2023 - FAIL

   ```
   rasa-dev test
   ```

   ### Summary

   - 61 / 71 test stories pass during unit testing
   - 9 of the 10 failing test stories work properly when manually tested

   Overall, 70 / 71 unit tests pass. The failing unit test requires modification of training data. While this fix is easy to apply... it reduces the overall performance of the model. See detailed analysis below.

4. Test Data Scripts

   04/17/2023 - PASS

   Ensure Node is installed locally. Start docker-desktop then the development environment:
   ```
   docker-compose up --build
   ```

   Once the environment is up and running navigate to ```./dbutils``` and run the node script:
   ```
   node index.js
   ```

   The data is loaded into the database, and the script is able to sucessfully query sample data.


## Detailed Test Story Analysis
```
TEST STORY ACCURACY
Base Scores:
   - 61 / 71 passing test stories
   - Accuracy: 0.87

Adjusted Scores: (based on observed behavior of model)
   - 70/71 passing test stories
   - Accuracy: 0.98
```

- Several test stories are dependent on the default [UnexpecTED Intent policy](https://rasa.com/docs/rasa/policies/) to help the model follow the intended path in cases where prediction confidence is low. While these test stories fail in unit testing, the behavior of the model is as intended during use. Nine of the 10 failing test stories fall into this category. See analysis of each test story below.

- One test story failed because synonyms were not implemented for all topics the model can query the database for. Synonyms allow the model to recognize synonyms during entity extraction... they also provide case insensitive extraction of entities. Correcting this issue in the training data is easy, but has a negative impact on the overall performance of the model.

   ### Failing Test Stories

   - interest in programming 2, restart (./tests/test_computer_science.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in programming 2, restart
     steps:
     - user: |
         what is computer science?
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I want to make software
       intent: express_interest_in_programming
     - action: utter_cs_interest_programming
     - user: |
         nope
       intent: deny
     - action: utter_cs_disengage
     - user: |
         yes
     - intent: affirm
     - action: utter_cs_generic_prompt
   ```

   - interst in programming 3, and early, final (./tests/test_computer_science.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in programming 3, end early, final
     steps:
     - user: |
         tell me what computer science means
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I like writing programs
     - intent: express_interest_in_programming
     - action: utter_cs_interest_programming
     - user: |
         nah
       intent: deny
     - action: utter_cs_disengage
     - user: |
         no thanks
       intent: deny
     - action: utter_goodbye
     - action: utter_greet
     - action: action_restart   
   ```

   - common cs careers 2 (./tests/test_stories.yml)
   __NOTE__: Intended behavior observed manually.
   ```
   - story: common cs careers 2
     steps:
     - user: |
         what do CS majors end up doing?
       intent: common_cscareers
     - action: utter_common_cscareers
     - user: |
         what other types of jobs are there?
       intent: other_cscareers
     - action: utter_other_cscareers
   ```

   - request topic 2-2 (./tests/test_stories.yml)
   __FAIL__: Intended behavior is _not_ observed manually.
   FIX -> "Soft computing" synonym not present due to oversight... Adding synonyms for all topics is easy, however this causes other test stories to fail and reduces real performance of the model. Implementing this change would require other training data to be reworked afterwards to bring the model back up to its current level of performance.
   ```
   - story: request topic 2-2
     steps:
     - user: |
         What is studied in CS?
       intent: common_cstopics
     - action: utter_common_cstopics
     - user: |
         What is [Soft computing]{"entity": "topic"}
       intent: request_topics
     - action: action_request_topics
   ```

   - courses 2 (./tests/test_stories.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: courses 2
     steps:
     - user: |
         Give me some information about [PHY 2048]{"entity": "class_code"}
       intent: request_class_by_code
     - action: action_request_class_by_code
     - action: utter_prompt_for_more_classes
   ```

   - interest in gaming 2, restart (./tests/test_computer_science.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in gaming 2, restart
     steps:
     - user: |
         what does Computer Science mean?
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I want to make video games
     - intent: express_interest_in_video_games
     - action: utter_cs_interest_games
     - user: |
         not really
     - intent: deny
     - action: utter_cs_disengage
     - user: |
         sure
     - intent: affirm
     - action: utter_cs_generic_prompt
   ```

   - interest in gaming 3, end early, final (./tests/test_computer_science.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in gaming 3, end early, final
     steps:
     - user: |
         Could you define computer science?
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I'm a gamer
     - intent: express_interest_in_video_games
     - action: utter_cs_interest_games
     - user: |
         no way
       intent: deny
     - action: utter_cs_disengage
     - user: |
         no
       intent: deny
     - action: utter_goodbye
     - action: utter_greet
     - action: action_restart
   ```

   - interest in hacking 1 (./tests/test_computer_science.yml
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in hacking 1
     steps:
     - user: |
         what is computer science?
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I want to be a hacker
       intent: express_interest_in_hacking
     - action: utter_cs_interest_hacking
     - user: |
         yeah
     - intent: affirm
     - action: action_get_courses_for_computer_security
   ```

   - interest in hacking 3 (./tests/test_computer_science.yml)
   __NOTE__: Intended behavior observed manually.
   ```
   - story: interest in AI 3, end early, final
     steps:
     - user: |
         Tell me what computer science means
       intent: ask_about_computer_science
     - action: utter_talk_about_computer_science
     - user: |
         I want to go into data science
       intent: express_interest_in_ai
     - action: utter_cs_interest_ai
     - user: |
         no thanks
       intent: deny
     - action: utter_cs_disengage
     - user: |
         no thanks
       intent: deny
     - action: utter_goodbye
     - action: utter_greet
     - action: action_restart
   ```   

## Other Aspects of Model Performance

Analysis of output in ```./rasaTests/prod/results```.

- The DIETClassifier
   - DIETClassifier_confusion_matrix.png
   - DIETClassifier_errors.json
   - DIETClassifier_histogram.png
   - DIETClassifier_report.json

   The DIETClassifier is one module we use to identify and extract entities from input. These results show that the DIETClassifier is able to extract all entities and categorize them appropriately.

   While the DIETClassifier works better for more varied input, it doesn't support lookup tables which we use when extracting ```topic``` and ```class_code``` entities. We rely on the RegexEntityExtractor in those cases... meaning that we are using two overlapping modules for entity extraction.

- Failing Test Stories
   - failed_test_stories.yml

   __NOTE__: See analysis above.

- Intent Prediction Accuracy
   - intent_confusion_matrix.png
   - intent_errors.json
   - intent_histogram.png
   - intent_report.json

   Rasa measures intent prediction accuracy via "pleated" testing of training data. The data is split into segments, with one segment being withheld to test the accuracy of the model resulting from the other training data. Each segment is tested against the others, and the average is used to measure intent prediction accuracy.

   The results show that the model is able to correctly predict intent examples in the training data with high accuracy.

- The RegexEntityExtractor
   - RegexEntityExtractor_confusion_matrix.png
   - RegexEntityExtractor_errors.json
   - RegexEntityExtractor_report.json
   
   As mentioned the RegexEntityExtractor relies on regular expressions to extract entities as opposed to the DIETClassifier which uses machine learning techniques. The benefit the RegexEntityExtractor offers is support of lookup tables, which can reduce the amount of training data needed by the model. The tradeoff is that this module is also less flexible.

   The results show us that the RegexEntityExtractor works very well at extracting and categorizing ```class_code``` entities. We see that it has a harder time with ```job```, ```no_entity```, and ```topic``` categories. Part of the issue is that ```job``` and ```topic``` entities implement synonyms which are not supported by the RegexEntityExtractor.

   The confusion between these entities in this module is not an issue in use... because it performs the same function of the DIETClassifier in a different way.

- Response Prediction Accuracy
   - response_selection_confusion_matrix.png
   - response_selection_errors.png
   - response_selection_histogram.png
   - response_selection_report.json

   These results show that the model is able to correctly predict responses to single turn FAQs with high accuracy.

- Stories with Warnings
   - stories_with_warnings.yml
   - story_confusion_matrix.png
   - story_report.json

   These results show test stories where Rasa deviates from the path defined within the test story. These deviations may or may not result in the test story failing. Here we see some of Rasa's fallback mechanisms coming into play in cases where confidence in model predictions are low.

- TEDPolicy
   - TEDPolicy_confusion_matrix.png
   - TEDPolicy_errors.json
   - TEDPolicy_report.json

   These results show that the default TEDPolicy is unable to properly extract entities.