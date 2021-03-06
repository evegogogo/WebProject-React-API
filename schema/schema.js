const graphql = require('graphql');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const Food = require('../models/food');
const Message = require('../models/message');
const Exercise = require('../models/exercise');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { result } = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLInt,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLScalarType,
    GraphQLBoolean
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
        status: { type: GraphQLString },
        date: { type: GraphQLString },
        liked: { type: GraphQLBoolean }
    })
});

const ExerciseType = new GraphQLObjectType({
    name: 'Exercise',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        status: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        date: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
        liked: { type: GraphQLBoolean }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
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

const DateType = new GraphQLScalarType({
    name: 'Date',
    fields: () => ({
        month: { type: GraphQLInt },
        day: { type: GraphQLInt },
        year: { type: GraphQLInt }
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

const userMessage = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        message: { type: GraphQLString }
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
        },
        login: {
            type: authData,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const user = await User.findOne({ email: args.email });
                if (!user) {
                    throw new Error("User does not exist!");
                }
                const isEqual = await bcrypt.compare(args.password, user.password);
                if (!isEqual) {
                    throw new Error('Password is incorrect!');
                }
                const token = jwt.sign({ id: user.id, email: user.email }, 'jingzheng', {
                    expiresIn: '1h'
                });
                return { id: user.id, token: token, tokenExpiration: 1 };
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: authData,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let user = await User.findOne({ email: args.email });

                if (user) {
                    throw new Error('User exists already.');
                }
                const hashedPassword = await bcrypt.hash(args.password, 12);

                user = new User({
                    name: args.name,
                    email: args.email,
                    password: hashedPassword
                });
                await user.save();
                const token = jwt.sign({ id: user.id, email: user.email, password: user.password }, 'jingzheng', {
                    expiresIn: '1h'
                });
                return { id: user.id, token: token, tokenExpiration: 1 };
                /* .then(result => {
                    return { ...result._doc }
                }) */

            }
        },
        addFood: {
            type: FoodType,
            args: {
                name: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                userId: { type: GraphQLID },
                status: { type: GraphQLString },
                date: { type: GraphQLString },
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                return Food.findOne({ name: args.name }).then(food => {
                    if (food) {
                        console.log('Food exists already.');
                    } else {
                        let food = new Food({
                            name: args.name,
                            calories: args.calories,
                            userId: args.userId,
                            status: args.status,
                            date: args.date,
                            liked: false
                        });
                        return food.save();
                    }
                });
            }
        },
        addExercise: {
            type: ExerciseType,
            args: {
                name: { type: GraphQLString },
                status: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                date: { type: GraphQLString },
                userId: { type: GraphQLID },
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                return Exercise.findOne({ name: args.name }).then(exercise => {
                    if (exercise) {
                        console.log('Exercise exists already.');
                    } else {
                        let exercise = new Exercise({
                            name: args.name,
                            calories: args.calories,
                            userId: args.userId,
                            status: args.status,
                            date: args.date,
                            liked: false
                        });
                        return exercise.save();
                    }
                });
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
                User.deleteOne({ email: args.email }).then(function () {
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
                User.updateOne({ email: args.email },
                    { name: args.name, password: args.password }, function (err, docs) {
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
                status: { type: GraphQLString },
                date: { type: GraphQLString },
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                Food.deleteOne({
                    name: args.name
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
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                console.log(args);
                Food.updateOne({ name: args.name },
                    { liked: args.liked }, function (err, docs) {
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
                date: { type: GraphQLString },
                userId: { type: GraphQLID },
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                Exercise.deleteOne({ name: args.name }).then(function () {
                    console.log("Data deleted"); // Success 
                }).catch(function (error) {
                    console.log(error); // Failure 
                });
            }
        },
        sendMessage: {
            type: userMessage,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                message: { type: GraphQLString }
            },
            resolve(parent, args) {
                let m = new Message({
                    name: args.name,
                    email: args.email,
                    message: args.message
                });
                return m.save();
            }
        },
        editExercise: {
            type: ExerciseType,
            args: {
                name: { type: GraphQLString },
                status: { type: GraphQLString },
                calories: { type: GraphQLFloat },
                date: { type: GraphQLString },
                userId: { type: GraphQLID },
                liked: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                Exercise.updateOne({ name: args.name },
                    { liked: !args.liked }, function (err, docs) {
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