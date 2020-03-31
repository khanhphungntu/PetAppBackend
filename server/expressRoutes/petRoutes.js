var express = require('express');
var petRoutes = express.Router();
var Pet = require('../models/pet');

// add new pet
petRoutes.route('/add').post(function (req, res) {

    var pet = new Pet(req.body, deletedAt = null);
    
    pet.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});


// delete pet from database (soft delete)
petRoutes.route('/:id').delete((req, res)=> {
    id = req.params.id;

    Pet.findById(id, (err, pet) => {
        
        if (!pet || err) return next(new Error('Could not load Document'));
        else {
            if (pet.deletedAt != null){
                res.json("Pet is already deleted!");
                return;
               }
            pet["deletedAt"] = Date.now();
            pet.save()
            .then(pet => {
                res.status(200).json("Deleted Successfully");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
            }
    });
});




//read pet
petRoutes.route('/:id').get(function(req,res){
    var id = req.params.id;

    Pet.findById(id,(err,pet) => {

        if(err) res.json(err);
        else{
            if (pet.deletedAt != null){
                res.json("Pet is already deleted!");
               }
            else res.status(200).json(pet); 
        }
     })

});

//get pet by customerid
petRoutes.route('/customer/:id').get(function(req,res){
    var id = req.params.id;

    Pet.find({customerId : id},(err,pet) => {

        if(err) res.json(err);
        else{
            if (pet.deletedAt != null){
                res.json("Pet is already deleted!");
               }
            else res.json(pet); 
        }
     })

});

//update pet
petRoutes.route('/:id').put(function(req,res){
    var id = req.params.id;
    var extractedId = req.id;

    Pet.findById(id, (err, pet) => {
        
        if (!pet || err) return next(new Error('Could not load Document'));
        else {
            if(extractedId != req.body.customerId){
                res.status(401).send('Unauthorized user');
                return;
            }
            
            else if (pet.deletedAt != null){
                res.json("Pet is already deleted!");
                return;
               }

            for ( item of Object.keys(req.body)){
                pet[item] = req.body[item];
            }

            pet.save()
            .then(pet => {
                res.status(200).json("Updated!");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })

});

module.exports = petRoutes;  