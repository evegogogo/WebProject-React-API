const graphql = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const Food = require('../models/food');
const Exercise = require('../models/exercise');
const User = require('../models/user');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLInt,
    GraphQLID,
    GraphQLSchema,
    GraphQLList
} = graphql;


/* var foods = [
    { id: '1', name: 'banana', calories: 300, userId: '2' },
    { id: '2', name: 'chicken', calories: 1000, userId: '2' },
    { id: '3', name: 'steak', calories: 2000, userId: '1' },
    { id: '4', name: 'fish', calories: 700, userId: '1' },
    { id: '5', name: 'milk', calories: 100, userId: '2' },
    { id: '6', name: 'burger', calories: 900, userId: '1' }
]; */

/* var exercises = [
    { id: '1', name: 'basketball', calories: 500, userId: '1' },
    { id: '2', name: 'lifting', calories: 600, userId: '1' },
    { id: '3', name: 'tennis', calories: 800, userId: '2' },
    { id: '4', name: 'swimming', calories: 900, userId: '1' },
    { id: '5', name: 'boxing', calories: 1200, userId: '2' },
];

var users = [
    { id: '1', name: 'jingzheng' },
    { id: '2', name: 'menglin' }
] */

const FoodType = new GraphQLObjectType({
    name: 'Food',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
        date: { type: GraphQLString }
    })
});

const ExerciseType = new GraphQLObjectType({
    name: 'Exercise',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        status: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        due: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        exercises: {
            type: new GraphQLList(ExerciseType),
            resolve(parent, args) {
                return Exercise.find({ userId: parent.id });
            }
        },
        foods: {
            type: new GraphQLList(FoodType),
            resolve(parent, args) {
                return Food.find({ userId: parent.id });
            }
        }
    })
});

const authData = new GraphQLObjectType({
    name: 'Token',
    fields: () => ({
        id: { type: GraphQLID },
        token: { type: GraphQLString },
        tokenExpiration: { type: GraphQLInt }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        food: {
            type: FoodType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Food.findById(args.id);
            }
        },
        exercise: {
            type: ExerciseType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Exercise.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        foods: {
            type: new GraphQLList(FoodType),
            resolve(parent, args) {
                return Food.find({});
            }
        },
        exercises: {
            type: new GraphQLList(ExerciseType),
            resolve(parent, args) {
                return Exercise.find({});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    password: args.password
                });
                return user.save();
            }
        },
        addFood: {
            type: FoodType,
            args: {
                name: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                userId: { type: GraphQLID },
                date: { type: GraphQLString }
            },
            resolve(parent, args) {
                let food = new Food({
                    name: args.name,
                    calories: args.calories,
                    userId: args.userId,
                    date: args.date
                });
                return food.save();
            }
        },
        addExercise: {
            type: ExerciseType,
            args: {
                name: { type: GraphQLString },
                status: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                due: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parents, args) {
                let exercise = new Exercise({
                    name: args.name,
                    status: args.status,
                    calories: args.calories,
                    due: args.due,
                    userId: args.userId
                });
                return exercise.save();
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                User.deleteOne({ email: args.email, password: args.password }).then(function () {
                    console.log("Data deleted"); // Success 
                }).catch(function (error) {
                    console.log(error); // Failure 
                });
            }
        },
        editUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                User.updateOne({ name: args.name, email: args.email },
                    { password: args.password }, function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Updated Docs : ", docs);
                        }
                    });
            }
        },
        deleteFood: {
            type: FoodType,
            args: {
                name: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                userId: { type: GraphQLID },
                date: { type: GraphQLString }
            },
            resolve(parent, args) {
                Food.deleteOne({
                    name: args.name, calories: args.calories,
                    userId: args.userId, date: args.date
                }).then(function () {
                    console.log("Data deleted"); // Success 
                }).catch(function (error) {
                    console.log(error); // Failure 
                });
            }
        },
        editFood: {
            type: FoodType,
            args: {
                name: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                userId: { type: GraphQLID },
                date: { type: GraphQLString }
            },
            resolve(parent, args) {
                Food.updateOne({ name: args.name, userId: args.userId },
                    { calories: args.calories, date: args.date }, function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Updated Docs : ", docs);
                        }
                    });
            }
        },
        deleteExercise: {
            type: ExerciseType,
            args: {
                name: { type: GraphQLString },
                status: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                due: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                Exercise.deleteOne({ name: args.name, status: args.status, userId: args.userId }).then(function () {
                    console.log("Data deleted"); // Success 
                }).catch(function (error) {
                    console.log(error); // Failure 
                });
            }
        },
        editExercise: {
            type: ExerciseType,
            args: {
                name: { type: GraphQLString },
                status: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                due: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                Exercise.updateOne({ name: args.name, userId: args.userId },
                    { status: args.status, calories: args.calories, due: args.due }, function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Updated Docs : ", docs);
                        }
                    });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})