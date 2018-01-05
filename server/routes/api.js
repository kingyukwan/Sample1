const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

/*router.get('/usersByNum', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find({cust_num:"C2"})
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});*/

router.post('/usersByNum', (req, res) => {
    console.log("parm="+req.body.custNum);
    connection((db) => {
        db.collection('users')
            .find({cust_num:req.body.custNum})
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/ordersByUser', (req, res) => {
    console.log("parm="+req.body.custNum);
    connection((db) => {
        db.collection('orders')
            .find({cust_num:req.body.custNum})
            .toArray()
            .then((orders) => {
                response.data = orders;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/orderSubmit', (req, res) => {
    console.log("parm="+req.body.custNum);
    connection((db) => {
        db.collection('orders')
            .insert({
                "ord_num":req.body.ordNum,
                "cust_num":req.body.custNum,
                "ord_date":req.body.ordDate
            })
            .then((orders) => {
                response.data = orders;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;