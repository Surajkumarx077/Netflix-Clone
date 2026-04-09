package com.netflix.clone.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String email;
    private String fullName;
    private String password;
}
