var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
AWS.config.loadFromPath('config.json');

var User = require('../models/user');

var ec2 = new AWS.EC2();
var elb = new AWS.ELB();

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.send(401);
}

router.get('/test',function(req,res){
    var user = new User();
    user.id="123";
    user.name = "hoge";
    user.facebookId = "facebookIDD";

   user.save(function(err){
       res.json({message:"OK"});
   });
});

router.get('/test2', isAuthenticated, function(req,res){
    console.log("youcansee auth page");
    //console.log(req);
    //res.end();
    res.json({message:"you can see authed page"});
});
router.get('/test3', function(req,res){
    console.log(req);
    res.end();
});

router.get('/', function (req, res, next) {
    ec2.describeInstances({}, function (err, data) {
        if (err) {
            return next(err);
        }
        var instanceList = [];
        var reservations = data.Reservations;
        for (var i = 0; i < reservations.length; i++) {
            var instances = reservations[i].Instances;
            for (var j = 0; j < instances.length; j++) {
                var tags = instances[j].Tags;
                var hostname = "";
                var env = "";
                var signal = "";
                for (var k = 0; k < tags.length; k++) {
                    if (tags[k].Key == "Name") {
                        var name = tags[k].Value;
                    }
                    if (tags[k].Key == "Hostname") {
                        hostname = tags[k].Value;
                    }
                    if (tags[k].Key == "Signal") {
                        signal = tags[k].Value;
                    }
                    if (tags[k].Key == "Env") {
                        env = tags[k].Value;
                    }
                }
                var content = {
                    ID: instances[j].InstanceId,
                    TagName: name,
                    HostName: hostname,
                    Env: env,
                    Signal: signal,
                    Status: instances[j].State.Name
                };
                instanceList.push(content);
            }
        }
        var obj = {InstanceDescriptions: instanceList}
        res.send(JSON.stringify(obj, undefined, 2));
    });
});

router.get('/start/:id', function (req, res, next) {
    var id = req.params.id;
    ec2.startInstances({InstanceIds: [id]}, function (err, data) {
        if (err) {
            return next(err);
        }
        // deregister, register ELB
        elb.describeLoadBalancers({}, function (err, data) {
            if (err) {
                return next(err);
            }
            var desc = data.LoadBalancerDescriptions;
            for (var i = 0; i < desc.length; i++) {
                var instances = desc[i].Instances;
                var name = desc[i].LoadBalancerName;
                for (var j = 0; j < instances.length; j++) {
                    if (instances[j]["InstanceId"] == id) {
                        // TODO need multiple instances consideration
                        var lbname = name;
                    }
                }
            }
        });

        if (lbname) {
            var params = {
                Instances: [
                    {
                        InstanceId: id
                    }
                ],
                LoadBalancerName: lbname
            }
            elb.deregisterInstancesFromLoadBalancer(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {
                    elb.registerInstancesWithLoadBalancer(params, function (err, data) {
                        if (err) {
                            console.log(err, err.stack);
                        }
                    });
                }
            });
        }
        res.send(data);
    });
});

router.get('/stop/:id', function (req, res,next) {
    ec2.stopInstances({InstanceIds: [req.params.id]}, function (err, data) {
        if (err) {
            return next(err);
        }
        res.send(data);
    });
});

module.exports = router;
