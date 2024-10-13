// schema.js
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const db = require('../cloud/firebase.js');

// Definimos el tipo Vehicle
const VehicleType = new GraphQLObjectType({
  name: 'Vehicle',
  fields: () => ({
    vehicleId: { type: GraphQLString },
    make: { type: GraphQLString },
    model: { type: GraphQLString },
    year: { type: GraphQLInt },
    vin: { type: GraphQLString },
    licensePlate: { type: GraphQLString },
    mileage: { type: GraphQLInt }
  })
});

// Definimos el tipo ServiceHistory
const ServiceHistoryType = new GraphQLObjectType({
  name: 'ServiceHistory',
  fields: () => ({
    serviceId: { type: GraphQLString },
    serviceDate: { type: GraphQLString },
    serviceType: { type: GraphQLString },
    mileageAtService: { type: GraphQLInt },
    cost: { type: GraphQLInt },
    serviceCenter: { type: GraphQLString },
    notes: { type: GraphQLString }
  })
});

// Definimos el tipo User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    userId: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    vehicles: {
      type: new GraphQLList(VehicleType),
      async resolve(parent, args) {
        const vehiclesRef = db.collection('users').doc(parent.userId).collection('vehicles');
        const snapshot = await vehiclesRef.get();
        return snapshot.docs.map(doc => ({ vehicleId: doc.id, ...doc.data() }));
      }
    }
  })
});

// Query para obtener los usuarios
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { userId: { type: GraphQLString } },
      async resolve(parent, args) {
        const userRef = db.collection('users').doc(args.userId);
        const doc = await userRef.get();
        if (!doc.exists) {
          throw new Error('User not found');
        }
        return { userId: doc.id, ...doc.data() };
      }
    },
    vehicle: {
      type: VehicleType,
      args: {
        userId: { type: GraphQLString },
        vehicleId: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const vehicleRef = db.collection('users').doc(args.userId).collection('vehicles').doc(args.vehicleId);
        const doc = await vehicleRef.get();
        if (!doc.exists) {
          throw new Error('Vehicle not found');
        }
        return { vehicleId: doc.id, ...doc.data() };
      }
    }
  }
});

// Mutaciones para añadir datos
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phoneNumber: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const newUser = {
          name: args.name,
          email: args.email,
          phoneNumber: args.phoneNumber
        };
        await db.collection('users').doc(args.userId).set(newUser);
        return { userId: args.userId, ...newUser };
      }
    },
    addVehicle: {
      type: VehicleType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        vehicleId: { type: new GraphQLNonNull(GraphQLString) },
        make: { type: new GraphQLNonNull(GraphQLString) },
        model: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLInt) },
        vin: { type: GraphQLString },
        licensePlate: { type: GraphQLString },
        mileage: { type: GraphQLInt }
      },
      async resolve(parent, args) {
        const newVehicle = {
          make: args.make,
          model: args.model,
          year: args.year,
          vin: args.vin,
          licensePlate: args.licensePlate,
          mileage: args.mileage
        };
        await db.collection('users').doc(args.userId).collection('vehicles').doc(args.vehicleId).set(newVehicle);
        return { vehicleId: args.vehicleId, ...newVehicle };
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
