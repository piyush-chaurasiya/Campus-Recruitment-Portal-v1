package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled()
        );
    }
}
