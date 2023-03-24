console.log("Initializing Class Database");

const { MongoClient } = require("mongodb");
const { parse } = require("csv-parse/sync");
let fs = require('fs');

const uri =
  "mongodb://localhost:27017?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('chompsci');
	
	/* Topic insert */
	const topics = database.collection('topics');
	await topics.deleteMany({});

	let comp_topics = []

	let rawTopicData = fs.readFileSync("./compsci-topicsdata.csv","utf-8");

	let parsedTopicData = parse(rawTopicData,{ delimiter: ",", from_line: 2 });

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

	await topics.insertMany(comp_topics);

	console.log("Insert Complete. Test query results for Discrete mathematics:");

	const search = { topic: 'Discrete mathematics' };
    const topic = await topics.findOne(search);
    console.log(topic);
	
	let dbCourseCount = await topics.estimatedDocumentCount();
	
	console.log("Data base current course count: "+dbCourseCount);
	
	/* Job insert */
	const job_list = database.collection('job_list');
	await job_list.deleteMany({});

	let list_jobs = []

	let rawJobData = fs.readFileSync("./CS-Jobs.csv","utf-8");

	let parsedJobData = parse(rawJobData,{ delimiter: ",", from_line: 2 });

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

	await job_list.insertMany(list_jobs);

	console.log("Insert Complete. Test query results for Computer Programmer: ");

	const search_query = { job: 'Computer Programmer' };
    const found_job = await job_list.findOne(search_query);
    console.log(found_job);

	let dbJobListCount = await job_list.estimatedDocumentCount();

	console.log("Data base current job_list count: " + dbJobListCount);

	/* Course insert */
    const courses = database.collection('courses');
    await courses.deleteMany({});
	
	let docs = []
	
	let rawCourseData = fs.readFileSync("./classdata.csv","utf-8");
	
	let parsedCourseData = parse(rawCourseData,{ delimiter: ",", from_line: 2 });
	
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
	
	await courses.insertMany(docs);

	console.log("Insert Complete. Test query results for COP 3530:")
	
    const query = { code: 'COP 3530' };
    const course = await courses.findOne(query);
    console.log(course);
	
	dbCourseCount = await courses.estimatedDocumentCount();
	
	console.log("Data base current course count: "+dbCourseCount);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);