const PORT = 3000;
const MOCK_COLLECTION_PATH = 'api/mock-definitions.json';

const express = require('express');
const bodyParser = require('body-parser');
const luxon = require('luxon');
const path = require('path');
const app = express(),
      port = PORT;

// timestamp and start_datetime are luxon.DateTime objects
function isTimestampRelevantToGranularity(timestamp, granularity, start_datetime) {
  let def_in_seconds = timestamp.toSeconds() - start_datetime.toSeconds();
  if (def_in_seconds < 0) return false;

  let granulation_obj = {};
  granulation_obj[granularity.units] = granularity.num;
  let granulation = luxon.Duration.fromObject(granulation_obj).toMillis() / 1000;

  return def_in_seconds % granulation == 0;
};

// start_datetime, end_datetime and target are luxon.DateTime objects
function isBetweenDateTimes(start_datetime, end_datetime, target) {
  let definition_interval = luxon.Interval.fromDateTimes(start_datetime, end_datetime);
  return definition_interval.contains(target);
}

// timestamp is a luxon.DateTime object
function getRelevantDefinitions(timestamp, callback) {
  const fs = require('fs');

  fs.readFile(MOCK_COLLECTION_PATH, (err, data) => {
      if (err) throw err;
      let definitions_collection = JSON.parse(data);
      let total_num = 0;

      if (definitions_collection && Array.isArray(definitions_collection)) {
        total_num = definitions_collection.length;
        definitions_collection = definitions_collection.filter((def) => {
          let timezone_str = `UTC${def.timezone}`;
          let start_datetime = luxon.DateTime.fromISO(def.start_datetime, {zone: timezone_str});
          let end_datetime = luxon.DateTime.fromISO(def.end_datetime, {zone: timezone_str});

          return isBetweenDateTimes(start_datetime, end_datetime, timestamp) &&
           isTimestampRelevantToGranularity(timestamp, def.granularity, start_datetime);
        });
      };
      
      if (callback) {
        callback(definitions_collection, total_num);
      };
  });
};

function getDefinitions(callback) {
  const fs = require('fs');

  fs.readFile(MOCK_COLLECTION_PATH, (err, data) => {
      if (err) throw err;
      let definitions_collection = JSON.parse(data);
      
      if (callback) {
        callback(definitions_collection);
      };
  });
};

function setDefinitions(definitions, callback) {
  const fs = require('fs');
  
  fs.writeFile(MOCK_COLLECTION_PATH, JSON.stringify(definitions), (err) => {
    if (err) throw err;
  });

  if (callback) {
    callback();
  };
};

// ‘treat' them by writes to log
function treatDefinitions(definitions, timestamp) {
  let treatedDefinitions = [];
  if (definitions && Array.isArray(definitions)) {
    definitions.forEach((def) => {
      if (def && def.recipients && Array.isArray(def.recipients)) {
        def.recipients.forEach((recp) => {
          console.log(`Email has been sent to ${recp.name} at address ${recp.email_address} at ${timestamp}. Email body:\
           ${def.body}`);
          // Mark them as ’treated’ with treatment timestamp
          def.treatment_datetime = timestamp;
        });
        treatedDefinitions.push(def);
      };
    });
  };

  return treatedDefinitions;
};

// Handling routes in express

app.use(express.static(path.join(__dirname, '../app/build')));
app.use(bodyParser.json());

app.get('/api/definition', async (req, res) => {
  getDefinitions((definitions) => {
    res.json(definitions);
  });
});

app.post('/api/definition', (req, res) => {
  let new_definitions = req.body;
  //Save with a unique auto-generated id, or let the DB create one for you (such as _id in Mongo)
  setDefinitions(new_definitions, () => {
    res.send("Ok");
  });
  
});

app.get('/api/definition/treat', async (req, res) => {
  const timestamp = req.query.timestamp ? luxon.DateTime.fromISO(req.query.timestamp) : luxon.DateTime.now();

  //Gets all relevant Definitions relevant to the given timeframe (default is ’now’)
  getRelevantDefinitions(timestamp, (relevant_definitions, total_num) => {
    let treated = treatDefinitions(relevant_definitions, timestamp);
    res.json({
      "total_num": total_num, 
      "treated": treated
    });
  });
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../app/build/index.html'));
});

//May use cluster module of node in order to utilize more of the available hardware resources
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});