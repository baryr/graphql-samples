package com.example.graphql;

import java.util.List;
import java.util.Optional;

public class AuthorDao {

    private List<Author> authors;

    public AuthorDao(List<Author> authors) {
        this.authors = authors;
    }

    public Optional<Author> getAuthor(String authorId) {
        return authors.stream().filter(author -> authorId.equals(author.getId())).findFirst();
    }
}
