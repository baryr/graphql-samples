package com.example.graphql.schema;

import com.example.graphql.mutation.UserMutation;
import com.example.graphql.query.UserQuery;
import graphql.annotations.GraphQLAnnotations;
import graphql.schema.GraphQLSchema;

public class UserSchema {

    private final GraphQLSchema schema;

    public UserSchema() throws IllegalAccessException, NoSuchMethodException, InstantiationException {
        schema = GraphQLSchema.newSchema().query(GraphQLAnnotations.object(UserQuery.class))
                .mutation(GraphQLAnnotations.object(UserMutation.class))
                .build();
    }

    public GraphQLSchema getSchema() {
        return schema;
    }
}
