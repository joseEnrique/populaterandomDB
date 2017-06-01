const Influx = require('influx');
const moment = require('moment');
var generateObject = require("./generate").generate;
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'agreements',
    schema: [{
        measurement: 'access',
        fields: {
            value: Influx.FieldType.INTEGER
        },

        tags: [
            'sla',
            'scope_tenant',
            'scope_account',
            'sender_host',
            'sender_environment',
            'sender_cluster',
            'measures_0_resource',
            'measures_0_method',
            'measures_0_result',
            'measures_0_ts',
            'measures_0_metrics_responseTime',
            'measures_0_metrics_animalTypes',
            'measures_0_metrics_resourceInstances',
            'measures_length'

        ]
    }]

})


function _populateInflux(url, opt, collection, urischema, duration, range, count) {
    //Test = mongoose.model(collection, new Schema(jsyaml.safeLoad(fs.readFileSync(schema, 'utf8'))), collection);

    influx.getDatabaseNames()
        .then(names => {
            if (!names.includes('agreements')) {
                return influx.createDatabase('agreements').then(function(succ) {
                    console.log(succ);
                }, function(err) {
                    console.log(err);
                })
            }
        })
        .then(() => {

            var objectTRand;
            var flattenObject;
            var counter_timer = 0;
            var interval = setInterval(function() {

                    if (counter_timer == 2) {
                        clearInterval(interval);

                    } else {
                        counter_timer++;
                    }
                    for (var i = 0; i < 1000000; i++) {
                        objectTRand = generateObject();
                        flattenObject = _flatten(objectTRand);
                        _writePoints(flattenObject)

                    }
                },
                range * 15000);



            /*

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
            })*/
        })
        .catch(err => {
            console.error(`Error creating Influx datasbase!` + err)
        })




}




function _flatten(obj, opt_out, opt_paths) {
    var out = opt_out || {};
    var paths = opt_paths || [];
    return Object.getOwnPropertyNames(obj).reduce(function(out, key) {
        paths.push(key);
        if (typeof obj[key] === 'object') {
            _flatten(obj[key], out, paths);
        } else {
            out[paths.join('_')] = obj[key];
        }
        paths.pop();
        return out;
    }, out)
}

function _writePoints(fields) {
    influx.writePoints([{
        measurement: 'access',
        tags: fields,
        fields: {
            value: 1
        },
        timestamp: moment(fields['measures_0_ts']).unix()
    }]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
    })
}



_populateInflux();
