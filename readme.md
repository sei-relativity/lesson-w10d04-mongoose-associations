<!--
Creator:
Location: SF
-->

# Data Associations with Mongoose

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)


## Why is this important

<!-- framing the "why" in big-picture/real world examples -->
*This workshop is important because:*

- Real-world data usually consists of different types of things that are related to each other in some way. An invoicing app might need to track employees, customers, and accounts. A food ordering app needs to know about restaurants, menus, and its users!  

- We've seen that when data is very simple, we can combine it all into one model.  When data is more complex or more loosely related, we often create two or more related models.

- Understanding how to plan for, set up, and use related data will help us build more full-featured applications.

## What are the objectives
<!-- specific/measurable goal for students to achieve -->
*After this workshop, developers will be able to:*


- Diagram one-to-one, one-to-many, and many-to-many data associations.
- Compare and contrast embedded & referenced data.
- Design nested server routes for associated resources.
- Build effective Mongoose queries for associated resources.

## Where should we be now

<!-- call out the skills that are prerequisites -->
*Before this workshop, developers should already be able to:*

* Use Mongoose to code Schemas and Models for single resources.
* Create, Read, Update, and Delete data with Mongoose.


## Numerical Categories for Relationships

### One-to-One

Each person has one brain, and each (living human) brain belongs to one person.

![one to one erd example](https://cloud.githubusercontent.com/assets/3254910/18140904/4d85c04e-6f6c-11e6-8301-c06bacff3dd3.png)

One-to-one relationships can sometimes just be modeled with simple attributes. A person and a brain are both complex enough that we might want to have their data in different models, with lots of different attributes on each.






### One-to-Many

Each leaf "belongs to" the one tree it grew from, and each tree "has many" leaves.

![one to many erd example](https://cloud.githubusercontent.com/assets/3254910/18182445/e4bddb6c-7044-11e6-9099-314b773724f3.png)


### Many-to-Many

Each student "has many" classes they attend, and each class "has many" students.


![many to many erd example](https://cloud.githubusercontent.com/assets/3254910/18140903/4c56c3ee-6f6c-11e6-9b6d-4c6ffae81323.png)


#### Entity Relationship Diagrams

Entity relationship diagrams (ERDs) represent information about the numerical relationships between data, or entities.

![entity relationship diagram example](https://cloud.githubusercontent.com/assets/3254910/18141666/439d9392-6f6f-11e6-953f-c91415b85f3f.png)



[More guidelines for ERDs](http://docs.oracle.com/cd/A87860_01/doc/java.817/a81358/05_dev1.htm)

#### Check for Understanding

Come up with an example of related data.  Draw the ERD for your relationship, including a few attributes for each model. 

### Association Categories for Mongoose

[Mongo Data Model Design](https://docs.mongodb.com/manual/core/data-model-design/)

**Embedded Data** is directly nested *inside* of other data. Each record has a copy of the data.


It is often *efficient* to embed data because you don't have to make a separate request or a separate database query -- the first request or query gets you all the information you need.  


![](https://i.imgur.com/HlLQJ0f.png)


**Referenced Data** is stored as an *id* inside other data. The id can be used to look up the information. All records that reference the same data look up the same copy.


It is usually easier to keep referenced records *consistent* because the data is only stored in one place and only needs to be updated in one place.  

![](https://i.imgur.com/90AztzB.png)


While the question of one-to-one, one-to-many, or  many-to-many is often determined by real-world characteristics of a relationship, the decision to embed or reference data is a design decision.  

There are tradeoffs, such as between *efficiency* and *consistency*, depending on which one you choose.  

When using Mongo and Mongoose, though, many-to-many relationships often involve referenced associations, while one-to-many often involve embedding data.


#### Check for Understanding

How would you design the following? Draw an ERD for each set of related data? Can you draw an ERD for each?

* `User`s with many `Tweets`?
* `Food`s with many `Ingredients`?


<br>

## Set-up Starter App

##### Initialize a directory

1. `mkdir mongoose-associations-app` and `cd` into it
2. `npm init -y`
3. `npm i express mongoose`
4. `touch server.js`

<br>

## Build Express Server

`server.js`

```js
const express = require('express');
const app = express();
const mongoose = require("mongoose");

const mongoURI = 'mongodb://localhost:27017/mongoRelationships';

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('the connection with mongod is established')
})

app.listen(3000, () => {
  console.log('listening');
});
```


<br>

## Implementation: Referenced

#### 1) Set Up Structure with Schemas

1. `mkdir models` 
1. `touch models/ingredient.js models/food.js`

`ingredient.js`

```javascript
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ingredientSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  origin: {
    type: String,
    default: ""
  }
})

var Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient
```

`food.js`

```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var foodSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  ingredients: [{
    type: Schema.Types.ObjectId,
    ref: 'Ingredient'
  }]
});

var Food = mongoose.model("Food", foodSchema);

module.exports = Food
```

Check out the value associated with the `ingredients` key inside the food schema. Here's how it's set up as an array of referenced ingredients:

- `[]` lets the food schema know that each food's `ingredients` will be an array
- The object inside the `[]` describes what kind of elements the array will hold.
- Giving `type: Schema.Types.ObjectId` tells the schema the `ingredients` array will hold ObjectIds. That's the type of that big beautiful `_id` that Mongo automatically generates for us (something like `55e4ce4ae83df339ba2478c6`).
- Giving `ref: Ingredient` tells the schema we will only be putting `Ingredient` instance ObjectIds inside the `ingredients` array.


<br>

## Seed file
Let's create a `seeds.js` file. Here's how we'd take our models for a spin and make two objects to test out creating a Ingredient document and Food document.

```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Food = require('./models/food');
var Ingredient = require('./models/ingredient');

const mongoURI = 'mongodb://localhost/mongoRelationships';
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('the connection with mongod is established')
});

// CREATE TWO INGREDIENTS
var cheddar = new Ingredient({
  name: 'cheddar cheese',
  origin: 'Wisconson'
});

var dough = new Ingredient({
  name: 'dough',
  origin: 'Iowa'
});

// SAVE THE TWO INGREDIENTS SO 
// WE HAVE ACCESS TO THEIR _IDS
cheddar.save(function (err, savedCheese) {
  if (err) {
    return console.log(err);
  } else {
    console.log('cheddar saved successfully');
  }
});

dough.save((err, savedCheese) => {
  if (err) {
    console.log(err)
  } else {
    console.log('dough saved successfully');
  }
})

// CREATE A NEW FOOD
var cheesyQuiche = new Food({
  name: 'Quiche',
  ingredients: []
});

// PUSH THE INGREDIENTS ONTO THE FOOD'S
// INGREDIENTS ARRAY
cheesyQuiche.ingredients.push(cheddar);   // associated!
cheesyQuiche.ingredients.push(dough);
cheesyQuiche.save(function (err, savedCheesyQuiche) {
  if (err) {
    return console.log(err);
  } else {
    console.log('cheesyQuiche food is ', savedCheesyQuiche);
  }
});
```

![](https://i.imgur.com/J6mO3TE.png)

- A lot of this set-up is also in the `server.js` file. That's ok.


Note that we push the `cheddar` ingredient document into the `cheesyQuiche` ingredients array. We already told the Food Schema that we will only be storing ObjectIds, though, so `cheddar` gets converted to its unique `_id` when it's pushed in!

Go into `mongo` and find the cheesy quiche:

![](https://i.imgur.com/gzc9S2C.png)

#### 3) Pull Data in With `.populate()`

When we want to get full information from an `Ingredient` document we have inside the `Food` document `ingredients` array, we use a method called `.populate()`.

We'll test out this code in a file called `test.js`.

1. `touch test.js`
2. After adding the code below, run `node test.js`


```js
var mongoose = require("mongoose");

var Food = require('./models/food');
var Ingredient = require('./models/ingredient');

const mongoURI = 'mongodb://localhost:27017/mongooseAssociationsInClass';
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('the connection with mongod is established')
});

Food.findOne({ name: 'Quiche' })
  .populate('ingredients')    // <- pull in ingredient data
  .exec((err, food) => {
    if (err) {
      return console.log(err);
    }
    if (food.ingredients.length > 0) {
      console.log(`I love ${food.name} for the ${food.ingredients[0].name}`);
    }
    else {
      console.log(`${food.name} has no ingredients.`);
    }
    console.log(`what was that food? ${food}`);
  });
```

<details><summary>Click to go over this method call line by line:</summary>

1. Line 1: We call a method to find only **one** `Food` document that matches the name: `Quiche`.

1. Line 2: We ask the ingredients array within that `Food` document to fetch the actual `Ingredient` document instead of just  its `ObjectId`.

1. Line 3: When we use `find` without a callback, then `populate`, like here, we can put a callback inside an `.exec()` method call. Technically we have made a query with `find`, but only executed it when we call `.exec()`.

1. Lines 4-15: If we have any errors, we will log them.  Otherwise, we can display the entire `Food` document **including** the populated `ingredients` array.

1. Line 9 demonstrates that we are able to access both data from the original `Food` document we found **and** the referenced `Ingredient` document we summoned.

</details>


**Query without `populate()`**

![](https://i.imgur.com/T33vFaz.png)

**Query with `populate()`**

![](https://i.imgur.com/9kjsf09.png)


Now, instead of seeing **only** the `ObjectId` that pointed us to the `Ingredient` document, we can see the **entire** `Ingredient` document.

#### Independent Practice: Foods & Ingredients

Tasks:  

In the seeds

1. Create 3 ingredients.  
2. Create a food that references those ingredients.  
3. List all the foods.  
4. List all the ingredient data for a food.



#### Routes for Referenced Data

When you need full information about a food, remember to pull ingredient data in with `populate`. Here's an example:

**INDEX of all foods**

`server.js`

```js
var Food = require('./models/food');
var Ingredient = require('./models/ingredient');

	...
	
// send all information for all foods
app.get('/api/foods/', (req, res) => {
  Food.find({ })
    .populate('ingredients')
    .exec((err, foods) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(`found and populated all foods: ${foods}`);
      res.json(foods);
    });
});
```

> Many APIs don't populate all referenced information before sending a response. For instance, the Spotify API is riddled with ids that developers can use to make a second request if they want more of the information.

#### Check for Understanding

On which of the following routes are you most likely to `populate` all the ingredients of a food you look up?


|               |                             |                                 |
| ------------- | --------------------------- | ------------------------------- |
| **HTTP Verb** | **Path**                    | **Description**                 |
| GET           | /foods                      | Get all foods                   |
| POST          | /foods                      | Create a food                   |
| GET           | /foods/:id                  | Get a food                      |
| DELETE        | /foods/:id                  | Delete a food                   |
| GET           | /foods/:food_id/ingredients | Get all ingredients from a food |


<br>

## Implementation: Embedded

Imagine you have a database of `User`s, each with many embedded `Tweet`s. If you needed to update or delete a tweet, you would first need to find the correct user, then the tweet to update or delete.


#### 1) Set Up Structure with Schemas

1. 	`touch models/user.js`	

```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  text: String,
  date: Date
});

var userSchema = new Schema({
  name: String,
  // embed tweets in user
  tweets: [tweetSchema]
});
```

The `tweets: [tweetSchema]` line sets up the embedded data association. The `[]` tells the schema to expect a collection, and `tweetSchema` (or `Tweet.schema` if you had a `Tweet` model defined already) tells the schema that the collection will hold *embedded* documents of type `Tweet`.

#### 2) Manipulate Data with Models

```js
var User = mongoose.model("User", userSchema);
var Tweet = mongoose.model("Tweet", tweetSchema);
```

#### 3) Export Models

```js
module.exports = { User, Tweet }
```

<details>
	<summary>Completed User model file</summary>
	
```js
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
	
var tweetSchema = new Schema({
  tweetText: String
}, { timestamps: true });
	
var userSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  tweets: [tweetSchema]
}, { timestamps: true });
	
var User = mongoose.model("User", userSchema);
var Tweet = mongoose.model("Tweet", tweetSchema);
	
module.exports = { User, Tweet }	
```
</details>

#### Independent Practice: Users & Tweets

1. Create a user.
1. Create tweets embedded in that user.
1. List all the users.
1. List all tweets of a specific user.

#### Routes for Embedded Data

**CREATE USER**

`server.js`

```js
var User = require('./models/user').User
var Tweet = require('./models/user').Tweet

	...
	
app.use(express.json())

	...

app.post('/api/users', (req, res) => {
  User.create(req.body, (error, newUser) => {
    res.json(newUser);
  })
})
```

![](https://i.imgur.com/1fyubyV.png)

**CREATE TWEET**

```js
// create tweet embedded in user
app.post('/api/users/:userId/tweets', (req, res) => {
  // store new tweet in memory with data from request body
  var newTweet = new Tweet({ tweetText: req.body.tweetText });

  // find user in db by id and add new tweet
  User.findById(req.params.userId, (error, foundUser) => {
    foundUser.tweets.push(newTweet);
    foundUser.save((err, savedUser) => {
      res.json(newTweet);
    });
  });
});
```

**UPDATE TWEET**

```js
// update tweet embedded in user
app.put('/api/users/:userId/tweets/:id', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;
  var tweetId = req.params.id;

  // find user in db by id
  User.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    var foundTweet = foundUser.tweets.id(tweetId);
    // update tweet text and completed with data from request body
    foundTweet.tweetText = req.body.tweetText;
    foundUser.save((err, savedUser) => {
      res.json(foundTweet);
    });
  });
});
```

### Route Design

Remember RESTful routing? It's the most popular modern convention for designing resource paths for nested data. Here is an example of an application that has routes for `Store` and `Item` models:

### RESTful Routing
|               |                                  |                             |                                                                                               |
| ------------- | -------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| **HTTP Verb** | **Path**                         | **Description**             | **Key Mongoose Method(s)**                                                                    |
| GET           | /stores                          | Get all stores              | <details><summary>click for ideas</summary>`.find`</details>                                  |
| POST          | /stores                          | Create a store              | <details><summary>click for ideas</summary>`new`, `.save`</details>                           |
| GET           | /stores/:id                      | Get a store                 | <details><summary>click for ideas</summary>`.findById`</details>                              |
| DELETE        | /stores/:id                      | Delete a store              | <details><summary>click for ideas</summary>`.findOneAndDelete`</details>                      |
| GET           | /stores/:store_id/items          | Get all items from a store  | <details><summary>click for ideas</summary>`.findById`, (`.populate` if referenced)</details> |
| POST          | /stores/:store_id/items          | Create an item for a store  | <details><summary>click for ideas</summary>`.findById`, `new`, `.save`</details>              |
| GET           | /stores/:store_id/items/:item_id | Get an item from a store    | <details><summary>click for ideas</summary>`.findOne`</details>                               |
| DELETE        | /stores/:store_id/items/:item_id | Delete an item from a store | <details><summary>click for ideas</summary>`.findOne`, `.remove`</details>                    |

*In routes, avoid nesting resources more than one level deep.*


## LABTIME

- Refactor the routes into individual controller files using [express.Router()](https://expressjs.com/en/guide/routing.html)
