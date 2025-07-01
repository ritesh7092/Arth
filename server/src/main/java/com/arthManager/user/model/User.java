package com.arthManager.user.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Collections;
import java.util.List;


@Data
@Entity
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;


    @Column(nullable = false, unique = false)
    private String email;

    private String role = "ROLE_USER";

    private String highestQualification;

    @ElementCollection
    private List<String> hobbies;

    private Boolean termsAccepted = false;

    private BigDecimal balance = BigDecimal.ZERO;

    private boolean emailVerified = false;



    // Overriding methods of UserDetails interface

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assuming a simple user role future provision
        // for more complex scenarios, I may want a Role entity
        // currently returns an empty list
        // return authorities if roles are added
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Fixed values, can have fields to represent state
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Fixed values,  can have fields to represent state
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Fixed values,  can have fields to represent state
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Fixed values, can have fields to represent state
        return true;
    }
}
