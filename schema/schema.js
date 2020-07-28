const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLID,
    GraphQLSchema
} = graphql;

var foods = [
    { id: '1', name: 'banana', calories: 300, userId: '2' },
    { id: '2', name: 'chicken', calories: 1000, userId: '2' },
    { id: '3', name: 'steak', calories: 2000, userId: '1' },
    { id: '4', name: 'fish', calories: 700, userId: '1' },
    { id: '5', name: 'milk', calories: 100, userId: '2' },
    { id: '6', name: 'burger', calories: 900, userId: '1' }
];

var exercises = [
    { id: '1', name: 'basketball', calories: 500, userId: '1' },
    { id: '2', name: 'lifting', calories: 600, userId: '1' },
    { id: '3', name: 'tennis', calories: 800, userId: '2' },
    { id: '4', name: 'swimming', calories: 900, userId: '1' },
    { id: '5', name: 'boxing', calories: 1200, userId: '2' },
];

var users = [
    { id: '1', name: 'jingzheng' },
    { id: '2', name: 'menglin' }
]

const FoodType = new GraphQLObjectType({
    name: 'Food',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        status: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                console.log(parent);
                return _.find(users, { id: parent.userId });
            }
        }
    })
});

const ExerciseType = new GraphQLObjectType({
    name: 'Exercise',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        status: { type: GraphQLString },
        user: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        due: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                console.log(parent);
                return _.find(users, { id: parent.userId });
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        exercise: {
            type: ExerciseType,
            resolve(parent, args) {
                console.log(parent);
                return _.find(exercises, { name })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        food: {
            type: FoodType,
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return _.find(foods, { name: args.name });
            }
        },
        exercise: {
            type: ExerciseType,
            args: { name: { type: GraphQLString } },
            resolve(parent, args) {
                return _.find(exercises, { name: args.name });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})