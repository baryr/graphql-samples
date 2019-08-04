package com.example.graphql.query;

import com.example.graphql.entity.User;
import com.example.graphql.handler.UserHandler;
import com.example.graphql.utils.SchemaUtils;
import graphql.annotations.GraphQLField;
import graphql.annotations.GraphQLName;
import graphql.schema.DataFetchingEnvironment;

import javax.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.graphql.utils.SchemaUtils.*;

@GraphQLName(QUERY)
public class UserQuery {

    @GraphQLField
    public static User retrieveUser(final DataFetchingEnvironment env, @NotNull @GraphQLName(ID) final String id) {
        final Optional<User> any = UserHandler.getUsers(env).stream()
                .filter(c -> c.getId() == Long.parseLong(id))
                .findFirst();
        return any.orElse(null);
    }

    @GraphQLField
    public static List<User> searchName(final DataFetchingEnvironment env, @NotNull @GraphQLName(NAME) final String name) {
        return UserHandler.getUsers(env).stream()
                .filter(c -> c.getName().contains(name))
                .collect(Collectors.toList());
    }

    @GraphQLField
    public static List<User> listUsers(final DataFetchingEnvironment env) {
        return UserHandler.getUsers(env);
    }

}
