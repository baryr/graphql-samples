package com.example.graphql.mutation;

import com.example.graphql.entity.User;
import com.example.graphql.handler.UserHandler;
import graphql.annotations.GraphQLField;
import graphql.annotations.GraphQLName;
import graphql.schema.DataFetchingEnvironment;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

import static com.example.graphql.utils.SchemaUtils.*;

import static com.example.graphql.handler.UserHandler.getUsers;

@GraphQLName(MUTATION)
public class UserMutation {

    @GraphQLField
    public static User createUser(final DataFetchingEnvironment env, @NotNull @GraphQLName(NAME) final String name, @NotNull @GraphQLName(EMAIL) final String email, @NotNull @GraphQLName(AGE) final String age) {
        List<User> users = getUsers(env);
        User user = new User(name, email, Integer.valueOf(age));
        users.add(user);
        return user;
    }

    @GraphQLField
    public static User updateUser(final DataFetchingEnvironment env, @NotNull @GraphQLName(ID) final String id, @NotNull @GraphQLName(NAME) final String name, @NotNull @GraphQLName(EMAIL) final String email, @NotNull @GraphQLName(AGE) String age) {
        Optional<User> user = getUsers(env).stream().filter(c -> c.getId() == Long.parseLong(id)).findFirst();
        if (!user.isPresent()) {
            return null;
        }

        user.get().setName(name);
        user.get().setEmail(email);
        user.get().setAge(Integer.valueOf(age));

        return user.get();
    }

    @GraphQLField
    public static User removeUser(final DataFetchingEnvironment env, @NotNull @GraphQLName(ID) final String id) {
        final List<User> users = getUsers(env);
        final Optional<User> user = users.stream().filter(c -> c.getId() == Long.parseLong(id)).findFirst();
        if (!user.isPresent()) {
            return null;
        }
        users.removeIf(c -> c.getId() == Long.parseLong(id));
        return user.get();
    }
}
