const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLSchema } = graphql;

var foods = [
    { id: '1', name: 'banana', calories: 300 },
    { id: '2', name: 'chicken', calories: 1000 },
    { id: '3', name: 'steak', calories: 2000 }
]

const FoodType = new GraphQLObjectType({
    name: 'Food',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        calories: { type: GraphQLFloat }
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
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})