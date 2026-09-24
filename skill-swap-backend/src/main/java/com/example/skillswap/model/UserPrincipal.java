package com.example.skillswap.model;

import java.security.Principal;

/**
 * Simple Principal implementation used to identify WebSocket users
 * by their userId (as a String) without requiring full JWT auth.
 */
public class UserPrincipal implements Principal {

    private final String name;

    public UserPrincipal(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
