console.log("Initializing Class Database");

const { MongoClient } = require("mongodb");
const { parse } = require("csv-parse/sync");
var fs = require('fs');

const uri =
  "mongodb://localhost:27017?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('chompsci');
	
	/* Topic insert */
	const topics = database.collection('topics');
	await topics.deleteMany({});

	var comp_topics = []

	var rawTopicData = fs.readFileSync("./compsci-topicsdata.csv","utf-8");

	var parsedTopicData = parse(rawTopicData,{ delimiter: ",", from_line: 2 });

	parsedTopicData.forEach(parsedTopic => {
		comp_topics.push(
			{
				topic: parsedTopic[0],
				lower_topic: parsedTopic[1],
				description: parsedTopic[2],
				keywords: parsedTopic[3],
				related_courses: parsedTopic[4],
				related_careers: parsedTopic[5]
			});
	});

	const res1 = await topics.insertMany(comp_topics);

	console.log("Insert Complete. Test query results for Discrete mathematics:");

	const search = { topic: 'Discrete mathematics' };
    const topic = await topics.findOne(search);
    console.log(topic);
	
	var dbCourseCount = await topics.estimatedDocumentCount();
	
	console.log("Data base current course count: "+dbCourseCount);
	
	/* Job insert */
	const job_list = database.collection('job_list');
	await job_list.deleteMany({});

	var list_jobs = []

	var rawJobData = fs.readFileSync("./CS-Jobs.csv","utf-8");

	var parsedJobData = parse(rawJobData,{ delimiter: ",", from_line: 2 });

	parsedJobData.forEach(parsedJob => {
		list_jobs.push(
			{
				job: parsedJob[0],
				job_lower: parsedJob[1],
				description: parsedJob[2],
				related_courses: parsedJob[3],
				keywords: parsedJob[4]
			});
	});

	const res = await job_list.insertMany(list_jobs);

	console.log("Insert Complete. Test query results for Computer Programmer: ");

	const search_query = { job: 'Computer Programmer' };
    const found_job = await job_list.findOne(search_query);
    console.log(found_job);

	var dbJobListCount = await job_list.estimatedDocumentCount();

	console.log("Data base current job_list count: " + dbJobListCount);

	/* Course insert */
    const courses = database.collection('courses');
    await courses.deleteMany({});

	const doc = {
      name: "Intro To Databases",
      description: "Basic class about databases",
    }
	
	var docs = []
	
	var rawCourseData = fs.readFileSync("./classdata.csv","utf-8");
	
	var parsedCourseData = parse(rawCourseData,{ delimiter: ",", from_line: 2 });
	
	parsedCourseData.forEach(parsedCourse => {
		docs.push(
			{
				code:parsedCourse[0],
				name:parsedCourse[1],
				description:parsedCourse[2],
				website:parsedCourse[3],
				credits:parsedCourse[4],
				prerequisites:parsedCourse[5],
				corequisites:parsedCourse[6]
			});
	});
	
	const result = await courses.insertMany(docs);

	console.log("Insert Complete. Test query results for COP 3530:")
	
    const query = { code: 'COP 3530' };
    const course = await courses.findOne(query);
    console.log(course);
	
	var dbCourseCount = await courses.estimatedDocumentCount();
	
	console.log("Data base current course count: "+dbCourseCount);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);