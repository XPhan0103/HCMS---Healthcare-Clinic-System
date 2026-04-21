package com.hcms.modules.auth.entity;

import com.hcms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing a system user with role-based access control.
 * ALL entities must extend BaseEntity.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    @Column(name = "username", nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String username;

    @Column(name = "password", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;

    @Column(name = "email", nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    public enum Role {
        ADMIN, DOCTOR, RECEPTIONIST, PARENT
    }
}
