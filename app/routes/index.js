'use strict';
/*
Define RESTful routes
*/
module.exports = function(app) {
    // INDEX route

    // NEW route
    app.get('/polls/new', (req, res) => {
        res.sendFile(__dirname + '/app/index.html');
    });

    // CREATE route
    app.post('/polls', (req, res) => {
        // first create the poll
        Poll.create(req.body.name, (err, poll) => {
            if (err) {
                console.log(err);
            } else {
                // then use async to individually create each option
                async.each(req.body.options, (option, callback) => {
                    Option.create(option, (err, option) => {
                        if (err) {
                            return callback(err);
                            // console.log('error creating option');
                        } else {
                            poll.options.push(option);
                            callback();
                        }
                    });
                }, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // send the created poll when all options
                        // are successfully created
                        poll.save();
                        res.json(poll);
                    }
                });
            }
        });
    });

    // API for SHOW route
    app.get('/api/polls/:id', (req, res) => {
        Poll.findById(req.params.id).populate('options').exec(function(err, poll) {
            if (err) {
                console.log(err);
            } else {
                res.json(poll);
            }
        })
    });

    // EDIT route

    // UPDATE route
    app.put('/polls/:id', (req, res) => {
        // get score from request and create new object
        const score = { score: req.body.score };
        Option.findByIdAndUpdate(req.params.id, score, { new: true }, (err, option) => {
            if (err) {
                console.log(err);
            } else {
                res.json(option);
            }
        });
    });

    // DELETE route

    // Route to handle all other requests
    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/app/index.html');
    });

}