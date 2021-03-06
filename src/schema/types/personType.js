// @flow
import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../relayNode";
import { createdField, editedField } from "../commonFields";
import { getObjectFromTypeAndId } from "../apiHelper";

import PlanetType from "./planetType";

// The GraphQL type equivalent of the People resource
const PersonType = new GraphQLObjectType({
  name: "Person",
  description:
    "An individual person or character within the Star Wars universe.",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: person => person.name,
      description: "The name of this person."
    },
    birthYear: {
      type: GraphQLString,
      resolve: person => person.birthYear,
      description: `The birth year of the person, using the in-universe standard of BBY or ABY -
Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is
a battle that occurs at the end of Star Wars episode IV: A New Hope.`
    },
    eyeColor: {
      type: GraphQLString,
      resolve: person => person.eyeColor,
      description: `The eye color of this person. Will be "unknown" if not known or "n/a" if the
person does not have an eye.`
    },
    gender: {
      type: GraphQLString,
      resolve: person => person.gender,
      description: `The gender of this person. Either "Male", "Female" or "unknown",
"n/a" if the person does not have a gender.`
    },
    hairColor: {
      type: GraphQLString,
      resolve: person => person.hairColor,
      description: `The hair color of this person. Will be "unknown" if not known or "n/a" if the
person does not have hair.`
    },
    height: {
      type: GraphQLInt,
      resolve: person => person.height,
      description: "The height of the person in centimeters."
    },
    mass: {
      type: GraphQLInt,
      resolve: person => person.mass,
      description: "The mass of the person in kilograms."
    },
    skinColor: {
      type: GraphQLString,
      resolve: person => person.skinColor,
      description: "The skin color of this person."
    },
    homeworld: {
      type: PlanetType,
      resolve: ({ homeworld }, args, viewer) =>
        getObjectFromTypeAndId(PlanetType, homeworld, viewer),
      description: "A planet that this person was born on or inhabits."
    },
    token: {
      type: GraphQLString,
      resolve: person => person.token,
      description: "A uniquely identifiable token."
    },
    personId: {
      type: GraphQLString,
      resolve: person => person.id,
      description: "A uniquely identifiable local id."
    },
    created: createdField(),
    edited: editedField(),
    id: globalIdField("people")
  }),
  interfaces: () => [nodeInterface]
});

export default PersonType;
