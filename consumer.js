const fs = require('fs');
const config = require('./config/config').config; 
const db = require('./db');

// ETERNAL LOOP
// it runs multiple times in a short interval indefinitely
const startReading = () => {
	let i = 0;
	for(let path in config.dir) {
			i++;
			// Reading first the commands from your database
			// Then reading positions, alarms, responses and exceptions from you filesystem
			// db.timeout() refers to a function that handles commands that are waiting response for long time
			// a if and else structure to route files properly to the functions
			setTimeout(() => {
				readFiles(config.dir[path], function(result) {
					if(result.length > 0) {
						if(result[0][0] == config.dir.positions)
							db.positions(result[0][1]);
						else if (result[0][0] == config.dir.alarms)
							db.alarms(result[0][1]);
						else if (result[0][0] == config.dir.responses)
							db.responses(result[0][1]);
						else if (result[0][0] == config.dir.exceptions)
							db.exceptions(result[0][1]);	
					}
				});
			}, i * 2000);	
	}

	db.commands();
	db.timeout();
};

// READING FILES
const readFiles = (path, callback) => {
    var ordered = [];
    if(path == config.dir.commands) {

    } else {
	    fs.readdir(path, (err, files) => {
	        if (err) { }
	        else {
	        	// Creating a array of your filenames
	            files.forEach(file => {
	                ordered.push(file);
	            });
	            // Ordering files by birth date
	            ordered.sort(function (a, b) {
	                return fs.statSync(path + b).birthtime - fs.statSync(path + a).birthtime;
	            });
	        
	        	let content_array = [];
	        	// Reading each file content
	        	// Afterwards, excluding it
	            ordered.map((file) => {
	            	content_array.push(
	            		new Promise((resolve, reject) => {
	            			fs.readFile(path + file, 'utf-8', (err, content) => {
	            				if (err) {  }
	            				else {
	            					fs.unlink(path + file, (err) => {
			                            if (err) {  }
			                            else {
			                               resolve([path, content]);
			                            }
	            					});
	            				}
	            			});
	            		})
		            );
	    		});

	            // Calling the callback to route the specific files
	            // to the respective functions passing the file content
	    		Promise.all(content_array).then(result => {
	    			callback(result);
	    		}).catch(reason => {  });
			}
		});
	}
}

setInterval(() => { startReading() }, 10000);
startReading();

