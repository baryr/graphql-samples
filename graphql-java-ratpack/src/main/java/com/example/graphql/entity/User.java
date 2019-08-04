package com.example.graphql.entity;

import com.example.graphql.handler.UserHandler;
import graphql.annotations.GraphQLField;
import graphql.annotations.GraphQLName;

import java.util.List;

@GraphQLName("user")
public class User {

    @GraphQLField
    private Long id;

    @GraphQLField
    private String name;

    @GraphQLField
    private String email;

    @GraphQLField
    private Integer age;

    public User(String name, String email, Integer age) {
        this.id = genId();
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public static Long genId() {
        Long id = 1L;
        try {
            List<User> users =  new UserHandler().getUsers();
            for (User user : users)
                id = (user.getId() > id ? user.getId() : id) + 1;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return id;
    }

    public String toString() {
        return "[id=" + id + ", name=" + name + ", email="+email+ ", age="+ age +"]";
    }

}
