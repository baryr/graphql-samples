package com.example.graphql.handler;

import com.example.graphql.entity.User;
import com.example.graphql.schema.UserSchema;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.DataFetchingEnvironment;
import ratpack.handling.Context;
import ratpack.handling.Handler;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import static com.example.graphql.utils.SchemaUtils.*;
import static ratpack.jackson.Jackson.json;

public class UserHandler implements Handler {

    private static final Logger LOGGER = Logger.getLogger(UserHandler.class.getSimpleName());

    private GraphQL graphql;
    private static List<User> users = new ArrayList<>();

    public UserHandler() throws Exception {
        graphql = GraphQL.newGraphQL((new UserSchema()).getSchema()).build();
    }

    public void handle(Context context) throws Exception {
        context.parse(Map.class).then(payload -> {

            Map<String,Object> parameters = (Map<String,Object>) payload.get(PARAMETERS);
            ExecutionResult executionResult = graphql.execute(payload.get(QUERY).toString(), null, null, parameters);

            Map<String, Object> result = new LinkedHashMap<>();
            if (executionResult.getErrors().isEmpty()) {
                result.put(DATA, executionResult.getData());
            } else {
                result.put(ERRORS, executionResult.getErrors());
                LOGGER.warning("Errors: " + executionResult.getErrors());
            }

            context.render(json(result));
        });

    }

    public static List<User> getUsers() {
        return users;
    }

    public static List<User> getUsers(DataFetchingEnvironment env) {
        return ((UserHandler) env.getSource()).getUsers();
    }
}
