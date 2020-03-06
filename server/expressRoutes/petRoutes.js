var express = require('express');
var petRoutes = express.Router();
var Pet = require('../models/pet');
const app = express();

// add new pet
petRoutes.route('/add').post(function (req, res) {

    var pet = new Pet(req.body);
    
    pet.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});


// delete pet from database
petRoutes.route('/:id').delete(function (req, res) {

    Pet.findByIdAndRemove({_id: req.params.id}, function(err, pet){

      if(err) res.json(err);
      else res.json('Successfully removed');

    });

});

//update pet
petRoutes.route('/:id').put(function(req,res){
    Pet.findByIdAndUpdate({_id: req.params.id},function(err, pet){
        
        if(err) res.json(err);
        else res.json('Successfully updated');
    })

});


//read pet
petRoutes.route('/:id').get(function(req,res){
    Pet.findById({_id: req.params.id},function(err,pet){

        if(err) res.json(err);
        else res.json(pet);
        
     })

});


module.exports = petRoutes;  