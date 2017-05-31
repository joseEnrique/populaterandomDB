const Influx = require('influx');


function _influxd() {

    const influx = new Influx.InfluxDB({
        host: 'localhost',
        database: 'express_response_db',
        schema: [{
            measurement: 'response_times',
            fields: {
                path: Influx.FieldType.STRING,
                duration: Influx.FieldType.INTEGER
            },

            tags: [
                'host'
            ]
        }]

    })

    influx.getDatabaseNames()

        .then(names => {
            if (!names.includes('express_response_db')) {
                return influx.createDatabase('express_response_db').then(function(succ) {
                    console.log(succ);
                }, function(err) {
                    console.log("sasas");
                    console.log(err);
                })
            }
        })
        .then(() => {
            influx.writePoints([{
                measurement: 'response_times',
                tags: {
                    host: "localhost"
                },
                fields: {
                    duration: 12,
                    path: "req.path"
                }
            }]).catch(err => {
                console.error(`Error saving data to InfluxDB! ${err.stack}`)
            })
        })
        .catch(err => {
            console.error(`Error creating Influx datasbase!` + err)
        })





}

_influxd();
