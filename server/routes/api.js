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

/*router.post('/usersByNum', (req, res) => {
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
});*/

router.post('/usersByNum', (req, res) => {
    console.log("parm="+req.body.custNum);
    connection((db) => {
        db.collection('users')
            .aggregate([
                {
                $lookup:
                    {
                    from: "orders",
                    localField: "cust_num",
                    foreignField: "cust_num",
                    as: "orders_docs"
                    }
                },
                {
                   $match: {"cust_num":req.body.custNum}
                }
            ])
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

router.post('/order', (req, res) => {
    console.log('countOrder');
    console.log("parm="+req.body.ordNum);
    connection((db) => {
        db.collection('orders')
            .find({ord_num:req.body.ordNum})
            .count()
            //.toArray()
            .then((orders) => {
                response.data = orders;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

/*router.post('/orderSubmit', (req, res) => {
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
});*/

router.post('/orderSubmit', (req, res) => {
    console.log("orderSubmit parm="+req.body.user.num+","+req.body.order.date);
    connection((db) => {
        db.collection('orders')
            .insert({
                "ord_num":req.body.order.num,
                "cust_num":req.body.user.num,
                "ord_date":req.body.order.date,
                "requiredDate":req.body.order.requiredDate,
                "shippedDate":req.body.order.shippedDate,
                "itemQty":req.body.order.itemQty,
                "status":req.body.order.status,
                "remarks":req.body.order.remarks
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

router.post('/orderUpdate', (req, res) => {
    console.log("orderUpdate parm="+req.body.order.num);
    connection((db) => {
        db.collection('orders')
            .update(
                { ord_num: req.body.order.num },
                {
                    "ord_num":req.body.order.num,
                    "cust_num":req.body.user.num,
                    "ord_date":req.body.order.date,
                    "requiredDate":req.body.order.requiredDate,
                    "shippedDate":req.body.order.shippedDate,
                    "itemQty":req.body.order.itemQty,
                    "status":req.body.order.status,
                    "remarks":req.body.order.remarks
                },
                { upsert: false }
            )
            .then((orders) => {
                response.data = orders;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/custUpdate', (req, res) => {
    console.log("custUpdate parm="+req.body.user.num);
    connection((db) => {
        db.collection('users')
            .update(
                { cust_num: req.body.user.num },
                {
                    "cust_num" : req.body.user.num, 
                    "cust_name": req.body.user.name, 
                    "contactLastName": req.body.user.contactLastName, 
                    "contactFirstName": req.body.user.contactFirstName, 
                    "phone": req.body.user.phone, 
                    "addressLine1": req.body.user.addressLine1, 
                    "addressLine2": req.body.user.addressLine2, 
                    "city": req.body.user.city, 
                    "email": req.body.user.email, 
                    "gender": req.body.user.gender, 
                    "creditLimit": req.body.user.creditLimit,
                    "createDate":"8/1/2018 12:00", 
                    "updateDate":"8/1/2018 12:00"
                },
                { upsert: false }
            )
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